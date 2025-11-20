import {
  ContractRef,
  KnownContracts,
  ContractAddressByChain,
} from '@/types';
import { Chains } from '@/services/smart-contracts/constants';
import {
  isAddress,
  Address,
  zeroAddress,
  getAddress,
} from 'viem';

// 🏗️ CONFIGURATION: Mapping Chain IDs to Contract Addresses.
// Using computed property names implies 'Chains' values are likely numbers.
const STREAMS_LIBRARY_BY_CHAIN: ContractAddressByChain = {
  [Chains.SomniaMainnet]: zeroAddress, // ⚠️ NOTE: Ensure consumers handle zeroAddress checks!
  [Chains.SomniaTestnet]: getAddress(
    '0x6AB397FF662e42312c003175DCD76EfF69D048Fc'
  ),
};

// 🗺️ REGISTRY: A central record of all known contracts.
// We map the KnownContracts enum to the chain-specific address map.
const KnownContractsByChain: Record<KnownContracts, Record<string | number, Address>> = {
  [KnownContracts.STREAMS]: STREAMS_LIBRARY_BY_CHAIN,
};

/**
 * Resolves a contract address based on a reference object.
 * * 🚀 OPTIMIZATION: Converted from 'async' to synchronous.
 * Looking up a value in a JS object is instant. Using Promises here adds
 * unnecessary overhead and forces strict await usage downstream.
 */
export function getContractAddress(ref: ContractRef): Address | null {
  // 1. Internal Contract Lookup
  if (ref.internal && ref.chainId) {
    // 🛡️ SAFETY: We use optional chaining and nullish coalescing
    // to safely handle cases where the chainId might not be configured yet.
    // We access via toString() or raw number depending on your Map definition, 
    // but casting to string covers most 'Record<string, ...>' cases.
    const chainMap = KnownContractsByChain[ref.internal];
    return chainMap?.[ref.chainId] ?? null;
  } 
  
  // 2. External/Raw Address Validation
  else if (ref.address) {
    // 🔍 VALIDATION: 'strict: false' allows non-checksum addresses, which is user-friendly.
    if (!isAddress(ref.address, { strict: false })) {
      throw new Error('Invalid address supplied');
    }
    
    // 🧹 NORMALIZATION: Always return the checksummed version of the address.
    // This ensures strict equality checks (===) work correctly elsewhere in the app.
    return getAddress(ref.address);
  }

  // 3. Fallback
  return null;
}
