import { getContractAddress } from "@/services/smart-contracts/address/index"
import { getABI } from "@/services/smart-contracts/abi/index"
import { ContractRef } from "@/types"
import { contractRefToString } from "@/types/utils"
import { isAddress, Abi, Address, isAddressEqual, zeroAddress } from "viem"

export type ContractAddressAndAbi = {
    abi: Abi,
    address: Address,
}

export async function getContractAddressAndAbi(ref: ContractRef): Promise<ContractAddressAndAbi> {
    const abi = await getABI(ref)
    if (!abi) {
        throw new Error(`Unable to resolve ABI for ${contractRefToString(ref)}`)
    }

    const address = await getContractAddress(ref)
    if (!address) {
        throw new Error(`Unable to resolve contract address for ${contractRefToString(ref)}`)
    }

    if (!isAddress(address, { strict: false })) {
        throw new Error(`Invalid contract address for ${contractRefToString(ref)}`)
    }

    if (isAddressEqual(address, zeroAddress)) {
        throw new Error(`No contract connected for ${contractRefToString(ref)}`)
    }

    return {
        abi,
        address
    }
}