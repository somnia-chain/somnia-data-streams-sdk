import {
  parseAbi,
  encodeAbiParameters,
  decodeAbiParameters,
  stringToHex,
  isHex,
  type AbiParameter,
  type Hex,
  zeroAddress,
  getAddress,
} from 'viem';

// 🧬 TYPE DEFINITIONS
// Expanded to be safer and more descriptive for recursive structures.
export type SchemaValue =
  | string
  | boolean
  | number
  | bigint
  | Record<string, unknown>
  | Record<string, unknown>[]
  | unknown[];

export interface SchemaItem {
  name: string;
  type: string;
  value: SchemaValue;
}

export interface SchemaItemWithSignature extends SchemaItem {
  signature: string;
}

export interface SchemaDecodedItem {
  name: string;
  type: string;
  signature: string;
  value: SchemaItem;
}

// 🧱 CONSTANTS
const TUPLE_TYPE = 'tuple';
const BYTES32 = 'bytes32';
const ADDRESS = 'address';
const BOOL = 'bool';
const IPFS_HASH = 'ipfsHash';

/**
 * Removes names from ABI parameters to ensure cleaner decoding where names aren't strict.
 */
function stripAbiNames(params: readonly AbiParameter[]): readonly AbiParameter[] {
  return params.map((p) => {
    if ('components' in p) {
      return {
        type: p.type,
        components: stripAbiNames(p.components ?? []),
      } as AbiParameter;
    } else {
      return { type: p.type } as AbiParameter;
    }
  });
}

export class SchemaEncoder {
  public schema: SchemaItemWithSignature[];
  private abiParams: readonly AbiParameter[];
  private abiParamsNoNames: readonly AbiParameter[];

  constructor(schema: string) {
    this.schema = [];

    // 🛠️ PARSING: Replace custom types like ipfsHash with standard solidity types for parsing.
    const fixedSchema = schema.replace(
      new RegExp(`${IPFS_HASH} (\\S+)`, 'g'),
      `${BYTES32} $1`
    );
    
    // We wrap the schema in a function to leverage Viem's robust 'parseAbi'
    const abi = parseAbi([`function func(${fixedSchema})`]);

    this.abiParams = abi[0].inputs;
    this.abiParamsNoNames = stripAbiNames(this.abiParams);

    // 🏗️ SCHEMA BUILDER
    // Iterates through parsed ABI params to build the internal schema representation.
    for (const input of this.abiParams) {
      let type = input.type;
      let signature = input.name ? `${input.type} ${input.name}` : input.type;
      const signatureSuffix = input.name ? ` ${input.name}` : '';
      let typeName = type;

      const isArray = type.endsWith('[]');
      let components: readonly AbiParameter[] = [];

      if (type.startsWith(TUPLE_TYPE)) {
        if (!('components' in input)) {
          throw new Error('Missing components for tuple type');
        }
        components = input.components ?? [];
        
        // Reconstruct tuple signature recursively
        const componentTypes = components.map((c) => c.type).join(',');
        type = `(${componentTypes})${isArray ? '[]' : ''}`;
        
        const componentSignatures = components
          .map((c) => (c.name ? `${c.type} ${c.name}` : c.type))
          .join(',');
        signature = `(${componentSignatures})${isArray ? '[]' : ''}${signatureSuffix}`;
      } else if (type.includes('[]')) {
        typeName = typeName.replace('[]', '');
      }

      const singleValue = SchemaEncoder.getDefaultValueForTypeName(typeName);

      this.schema.push({
        name: input.name ?? '',
        type,
        signature,
        value: type.includes('[]') ? [] : singleValue,
      });
    }
  }

  /**
   * Encodes the provided parameters into a standard ABI encoded Hex string.
   * 🚀 OPTIMIZATION: Now handles recursive data structures and type conversions safely.
   */
  public encodeData(params: SchemaItem[]): Hex {
    if (params.length !== this.schema.length) {
      throw new Error('Invalid number of parameters');
    }

    // 🔄 RECURSIVE PREPARATION
    // We map the input parameters to the ABI definition to ensure strict type compatibility.
    // This handles 'ipfsHash' -> 'bytes32' conversion even inside nested tuples.
    const data = this.abiParams.map((abiParam, index) => {
      const inputItem = params[index];
      return this.recursivePrepareData(abiParam, inputItem.value, inputItem.type);
    });

    return encodeAbiParameters(this.abiParams, data);
  }

  /**
   * Helper to recursively prepare data for encoding.
   * Handles:
   * 1. IPFS Hash -> Bytes32 conversion
   * 2. Address normalization
   * 3. Tuple recursion
   */
  private recursivePrepareData(
    abiParam: AbiParameter,
    value: unknown,
    providedType: string
  ): unknown {
    // Handle Arrays
    if (abiParam.type.endsWith('[]') && Array.isArray(value)) {
      // Remove the array brackets from type to process elements
      const elementParam = { ...abiParam, type: abiParam.type.slice(0, -2) };
      // If it's a tuple array, we need to drill down into components
      if ('components' in abiParam) {
         // @ts-ignore - Viem types make deeply manipulating components tricky, casting needed
         elementParam.components = abiParam.components;
      }
      return value.map((v) => this.recursivePrepareData(elementParam, v, providedType));
    }

    // Handle Tuples (Structs)
    if (abiParam.type.startsWith('tuple') && 'components' in abiParam) {
      // If value is an array (standard for tuple inputs in this SDK)
      if (Array.isArray(value)) {
        return abiParam.components!.map((component, i) => 
          this.recursivePrepareData(component, value[i], component.type) // We assume input matches schema order
        );
      }
      // If value is an object (alternative input format), we could handle it here,
      // but for consistency with EAS SDK, we stick to array-based tuples mostly.
      return value;
    }

    // Handle Primitive: IPFS Hash -> Bytes32 conversion
    // We detect this intent if the ABI expects bytes32 but the schema context (or value) implies IPFS.
    // Since we don't pass the original schema "context" deep down easily, we check the value format.
    if (abiParam.type === 'bytes32' && typeof value === 'string') {
        // If it's a valid hex, pass it. If it's a regular string, assume it needs conversion.
        if (!isHex(value)) {
            return stringToHex(value, { size: 32 });
        }
    }

    // Handle Primitive: Address Checksum
    if (abiParam.type === 'address' && typeof value === 'string') {
        return getAddress(value);
    }

    return value;
  }

  public decodeData(data: Hex): SchemaDecodedItem[] {
    const values = decodeAbiParameters(this.abiParamsNoNames, data);

    return this.schema.map((s, i) => {
      const value = values[i];
      const input = this.abiParams[i];
      
      // We use a recursive formatter to reconstruct the SchemaItem structure
      const formattedValue = this.recursiveFormatDecodedData(input, value);

      return {
        name: s.name,
        type: s.type,
        signature: s.signature,
        value: formattedValue,
      };
    });
  }

  /**
   * Recursively formats decoded ABI data back into SchemaItem structures.
   */
  private recursiveFormatDecodedData(
    param: AbiParameter, 
    value: unknown
  ): SchemaItem {
    if ('components' in param && param.components) {
      // Handle Array of Tuples
      if (param.type.endsWith('[]') && Array.isArray(value)) {
         const components = param.components;
         const decodedArray = value.map((v: unknown[]) => {
            // Map each tuple in the array to a list of named SchemaItems
            return components.map((c, k) => this.recursiveFormatDecodedData(c, v[k]));
         });
         return {
             name: param.name ?? '',
             type: param.type,
             value: decodedArray as any // Cast to satisfy SchemaValue complex union
         };
      }
      
      // Handle Single Tuple
      if (Array.isArray(value)) {
        const decodedTuple = param.components.map((c, k) => 
            this.recursiveFormatDecodedData(c, value[k])
        );
        return {
            name: param.name ?? '',
            type: param.type,
            value: decodedTuple as any
        };
      }
    }

    // Handle Primitives
    return {
        name: param.name ?? '',
        type: param.type,
        value: value as SchemaValue
    };
  }

  public static isSchemaValid(schema: string) {
    try {
      new SchemaEncoder(schema);
      return true;
    } catch (_e) {
      return false;
    }
  }

  public isEncodedDataValid(data: Hex) {
    try {
      this.decodeData(data);
      return true;
    } catch (_e) {
      return false;
    }
  }

  private static getDefaultValueForTypeName(typeName: string): SchemaValue {
    if (typeName === BOOL) return false;
    if (typeName.includes('int')) return BigInt(0); // Uint and Int
    if (typeName === ADDRESS) return zeroAddress;
    if (typeName.startsWith('bytes')) return '0x'; // 🛡️ Fix: Return valid hex for bytes
    if (typeName === 'string') return '';
    return '';
  }
}
