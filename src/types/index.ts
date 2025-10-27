import { Address, PublicClient, WalletClient } from "viem"
import { Chains } from "@/services/smart-contracts/constants"

export enum KnownContracts {
    STREAMS = "STREAMS"
}

export type ContractAddressByChain = Record<Chains, Address>

export type Client = {
    public: PublicClient,
    wallet?: WalletClient
}

export type ContractRef = {
    chainId: number
    internal?: KnownContracts
    address?: Address
}