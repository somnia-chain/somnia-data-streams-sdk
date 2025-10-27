import { StreamsABI } from "./Streams"
import { ContractRef, KnownContracts } from "@/types"
import { isAddress } from "viem"

export async function getABI(ref: ContractRef) {
    if (ref.internal) {
        switch (ref.internal) {
            case KnownContracts.STREAMS:
                return StreamsABI()
        }
    } else if (ref.address) {
        // Future: resolve ABI from Etherbase
        if (!isAddress(ref.address, { strict: false })) {
            throw new Error("Invalid address supplied")
        }
        throw new Error("Feature not implemented")
    }
}