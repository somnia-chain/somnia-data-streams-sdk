import {
    ContractRef,
    KnownContracts,
    ContractAddressByChain
} from "@/types"
import { Chains } from "@/services/smart-contracts/constants"
import {
    isAddress,
    Address,
    zeroAddress,
    getAddress,
} from "viem"

const STREAMS_LIBRARY_BY_CHAIN: ContractAddressByChain = {
    [Chains.SomniaMainnet]: zeroAddress,
    [Chains.SomniaTestnet]: getAddress(
        "0xCe083187451f5DcBfA868e08569273a03Bb0d2de"
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