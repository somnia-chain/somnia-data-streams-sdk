// Viem version of: https://github.com/ethereum-attestation-service/eas-sdk/blob/master/src/schema-encoder.ts

import {
    parseAbi,
    encodeAbiParameters,
    decodeAbiParameters,
    stringToHex,
    isHex,
    type AbiParameter,
    type Hex,
    zeroAddress
} from "viem";

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

const TUPLE_TYPE = "tuple";
const BYTES32 = "bytes32";
const ADDRESS = "address";
const BOOL = "bool";
const IPFS_HASH = "ipfsHash";

function stripAbiNames(params: readonly AbiParameter[]): AbiParameter[] {
  return params.map((p) => {
    if ("components" in p) {
      return {
        type: p.type,
        components: stripAbiNames(p.components ?? []),
      };
    } else {
      return { type: p.type };
    }
  });
}

export class SchemaEncoder {
  public schema: SchemaItemWithSignature[];
  private abiParams: readonly AbiParameter[];
  private abiParamsNoNames: AbiParameter[];

  constructor(schema: string) {
    this.schema = [];

    const fixedSchema = schema.replace(new RegExp(`${IPFS_HASH} (\\S+)`, "g"), `${BYTES32} $1`);
    const abi = parseAbi([`function func(${fixedSchema})`]);

    this.abiParams = abi[0].inputs;
    this.abiParamsNoNames = stripAbiNames(this.abiParams);

    for (const input of this.abiParams) {
      let type = input.type;
      let signature = input.name ? `${input.type} ${input.name}` : input.type;
      const signatureSuffix = input.name ? ` ${input.name}` : "";
      let typeName = type;

      const isArray = type.endsWith("[]");
      let components: readonly AbiParameter[] = [];
      if (type.startsWith(TUPLE_TYPE)) {
        if (!("components" in input)) throw new Error("Missing components for tuple type");
        components = input.components ?? [];
        type = `(${components.map((c) => c.type).join(",")})${isArray ? "[]" : ""}`;
        signature = `(${components.map((c) => (c.name ? `${c.type} ${c.name}` : c.type)).join(",")})${
          isArray ? "[]" : ""
        }${signatureSuffix}`;
      } else if (type.includes("[]")) {
        typeName = typeName.replace("[]", "");
      }

      const singleValue = SchemaEncoder.getDefaultValueForTypeName(typeName);

      this.schema.push({
        name: input.name ?? "",
        type,
        signature,
        value: type.includes("[]") ? [] : singleValue
      });
    }
  }

  public encodeData(params: SchemaItem[]): Hex {
    if (params.length !== this.schema.length) {
      throw new Error("Invalid number or values");
    }

    const data = [];

    for (const [index, schemaItem] of this.schema.entries()) {
      const { type, name, value } = params[index];
      const sanitizedType = type.replace(/\s/g, "");

      if (
        sanitizedType !== schemaItem.type &&
        sanitizedType !== schemaItem.signature &&
        !(sanitizedType === IPFS_HASH && schemaItem.type === BYTES32)
      ) {
        throw new Error(`Incompatible param type: ${sanitizedType}`);
      }

      if (name !== schemaItem.name) {
        throw new Error(`Incompatible param name: ${name}`);
      }

      data.push(
        schemaItem.type === BYTES32 && typeof value === "string" && !isHex(value)
            ? stringToHex(value, { size: 32 })
            : value
      );
    }

    return encodeAbiParameters(this.abiParams, data);
  }

  public decodeData(data: Hex): SchemaDecodedItem[] {
    const values = decodeAbiParameters(this.abiParamsNoNames, data);

    return this.schema.map((s, i) => {
      let value = values[i];
      const input = this.abiParams[i];
      const components: readonly AbiParameter[] = "components" in input ? input.components ?? [] : [];

      if (components.length > 0) {
        if (input.type.endsWith("[]")) {
          const namedValues: SchemaItem[][] = [];

          for (const val of value as readonly unknown[][]) {
            const namedValue: SchemaItem[] = [];
            for (const [k, v] of val.entries()) {
              const component = components[k];
              namedValue.push({ name: component.name ?? "", type: component.type, value: v as SchemaValue });
            }
            namedValues.push(namedValue);
          }

          value = {
            name: s.name,
            type: s.type,
            value: namedValues
          };
        } else {
          const namedValue: SchemaItem[] = [];
          for (const [k, v] of (value as readonly unknown[]).entries()) {
            const component = components[k];
            namedValue.push({ name: component.name ?? "", type: component.type, value: v as SchemaValue });
          }

          value = {
            name: s.name,
            type: s.type,
            value: namedValue
          };
        }
      } else {
        value = { name: s.name, type: s.type, value: value as SchemaValue };
      }

      return {
        name: s.name,
        type: s.type,
        signature: s.signature,
        value: value as SchemaItem
      };
    });
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

  private static getDefaultValueForTypeName(typeName: string) {
    if (typeName === BOOL) return false;
    if (typeName.includes("int")) return BigInt(0);
    if (typeName === ADDRESS) return zeroAddress;
    return "";
  }

}