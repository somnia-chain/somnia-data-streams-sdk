import { ContractRef } from "../index"

export function contractRefToString(ref: ContractRef) {
    const internalRef = ref.internal ? `${ref.internal}` : "UnknownContract"
    const addressRef = ref.address ? `${ref.address}` : "InvalidAddress"
    return `${ref.chainId}:${internalRef}:${addressRef}`
}