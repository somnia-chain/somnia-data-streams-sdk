import { isAddress, isAddressEqual, zeroAddress, Address } from "viem"

export function assertAddressIsValid(address: Address, disableZeroAddressCheck?: boolean) {
    if (!isAddress(address, { strict: false })) {
        throw new Error(`Invalid address`)
    }

    if (!disableZeroAddressCheck && isAddressEqual(address, zeroAddress)) {
        throw new Error(`Zero address supplied`)
    }
}