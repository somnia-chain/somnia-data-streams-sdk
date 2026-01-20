import {
    ContractRef,
    KnownContracts,
    ContractAddressByChain
} from "@/types"
import { Chains } from "@/services/smart-contracts/constants"
import {
    isAddress,
    Address,
    getAddress,
} from "viem"

const STREAMS_LIBRARY_BY_CHAIN: ContractAddressByChain = {
    [Chains.SomniaMainnet]: getAddress(
        "0x7EF39B35f80F14b2eE479248d27b5014C1C64AD0"
    ),
    [Chains.SomniaTestnet]: getAddress(
        "0xB1Ae08D3d1542eF9971A63Aede2dB8d0239c78d4"
    ),
}

const KnownContractsByChain: Record<KnownContracts, Record<string, Address>> = {
    [KnownContracts.STREAMS]: STREAMS_LIBRARY_BY_CHAIN,
}

export async function getContractAddress(ref: ContractRef): Promise<Address | null> {
    if (ref.internal && ref.chainId) {
        return KnownContractsByChain[ref.internal][ref.chainId.toString()] ?? null
    } else if (ref.address) {
        if (!isAddress(ref.address, { strict: false })) {
            throw new Error("Invalid address supplied")
        }
        return ref.address!
    }
    return null
}