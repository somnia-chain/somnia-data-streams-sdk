import { isAddress, isAddressEqual, zeroAddress, Address } from 'viem';

/**
 * Validates if a string is a valid EVM address and optionally checks for the zero address.
 * * 🧠 SMART CHANGE: Input type changed from 'Address' to 'string'.
 * If we already typed it as 'Address', validation would be redundant. 
 * We validate raw strings to turn them into trusted 'Address' types.
 */
export function assertAddressIsValid(
  address: string, 
  disableZeroAddressCheck?: boolean
): asserts address is Address { // ✨ TYPE MAGIC: Tells TS "If this function returns, 'address' is definitely an 'Address'"
  
  // 1. Structural Validation
  // 'strict: false' is good UX as it allows mixed-cased addresses.
  if (!isAddress(address, { strict: false })) {
    // 🐞 DEBUGGING FIX: Included the invalid value in the error message.
    // This saves hours of debugging time when looking at server logs.
    throw new Error(`Invalid address provided: "${address}"`);
  }

  // 2. Logic Validation (Zero Address)
  // We use 'as Address' because 'isAddress' check above guarantees structure,
  // allowing 'isAddressEqual' to work safely without TS complaints.
  if (!disableZeroAddressCheck && isAddressEqual(address as Address, zeroAddress)) {
    throw new Error('Zero address (0x00...00) is not allowed in this context');
  }
}
