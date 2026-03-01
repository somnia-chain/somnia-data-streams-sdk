import { BaseError, ContractFunctionRevertedError } from 'viem';

export function maybeLogContractError(e: unknown, context: string): Error | null {
  // 🔍 TYPE CHECK: Ensure the error originates from viem (BaseError).
  if (e instanceof BaseError) {
    // 🚶 WALK THE CHAIN: Viem errors wrap original errors. We use 'walk' to find
    // the specific 'ContractFunctionRevertedError' regardless of how deep it is nested.
    const revertError = e.walk(
      (err) => err instanceof ContractFunctionRevertedError
    ) as ContractFunctionRevertedError | null;

    if (revertError) {
      // 🏷️ DATA EXTRACTION: Get the error name, defaulting to a generic string if undefined.
      const errorName = revertError.data?.errorName ?? 'UnknownContractError';
      
      // 📦 ARGUMENTS CAPTURE: Critical! Capture the error arguments (args).
      // e.g., If the error is 'InsufficientFunds(needed, has)', we need those values.
      const errorArgs = revertError.data?.args;

      // 📝 LOGGING: Use console.warn or console.error for visibility.
      // We log the structured object for easier debugging.
      console.warn({ 
        errorType: 'Contract Function Reverted', 
        context, 
        errorName,
        args: errorArgs // Included args in the log
      });

      // 🔗 CHAIN PRESERVATION: Create a new Error but attach the original error as 'cause'.
      // This preserves the stack trace and allows upstream handlers to see the root cause.
      return new Error(errorName, { cause: e });
    }
  }

  // Return null if it wasn't a contract revert error, allowing the caller to handle other error types.
  return null;
}
