import { BaseError, ContractFunctionRevertedError } from "viem"

export function maybeLogContractError(e: unknown, context: string): Error | null {
    let error: Error | null = null
    if (e instanceof BaseError) {
        const revertError = e.walk(
            (err) => err instanceof ContractFunctionRevertedError,
        )
        if (revertError instanceof ContractFunctionRevertedError) {
            const errorName = revertError.data?.errorName ?? "UnknownError"
            console.log({ errorType: "Contract Error", context, errorName })
            error = new Error(errorName)
        }
    }
    return error
}