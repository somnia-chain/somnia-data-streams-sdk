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
        "0xC1d833a80469854a7450Dd187224b2ceE5ecE264"
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