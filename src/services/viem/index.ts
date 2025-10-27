import { 
    Address,
    Abi,
    Account,
    TransactionReceipt,
    getContract as getContractViem,
    WalletClient,
} from "viem"
import { ContractAddressAndAbi } from "@/services/smart-contracts"
import { Client } from "@/types"
 
export class Viem {
    client: Client
    private chainId: number = 0

    constructor(client: Client) {
        this.client = client;
    }

    async getChainId(): Promise<number> {
        if (this.chainId === 0) {
            this.chainId = await this.client.public.getChainId()
        }
        return this.chainId
    }

    getContract(contractInfo: ContractAddressAndAbi) {
        return getContractViem({
            address: contractInfo.address,
            abi: contractInfo.abi,
            client: this.client.public
        })
    }

    async readContract<T>(address: Address, abi: Abi, functionName: string, args: unknown[] = []) {
        return this.client.public.readContract({
            address,
            abi,
            functionName,
            args
        }) as Promise<T>
    }

    async writeContract(
        address: Address,
        abi: Abi,
        functionName: string,
        args: unknown[] = [],
        value: bigint = BigInt(0)
    ) {
        if (!this.client.wallet) {
            return null
        }
        const account: `0x${string}` | Account | null = this.client.wallet.account ?? null
        return this.client.wallet.writeContract({
            address,
            abi,
            functionName,
            args,
            value,
            account,
            chain: this.client.wallet.chain
        })
    }

    async waitForTransaction(hash: `0x${string}`): Promise<TransactionReceipt> {
        return this.client.public.waitForTransactionReceipt({
            hash
        })
    }

    async getCurrentAccounts(): Promise<Address[]> {

        // If a wallet client is not injected, stop early
        if (!this.client.wallet) {
            throw new Error("No wallet client")
        }

        let accounts: Address[] = []
        if (this.client.wallet.account) {
            // If we have a single account, push that as the only address
            accounts.push(this.client.wallet.account.address)
        } else {
            // A different wallet client type has been supplied
            // Check for accounts using the regular viem wallet client
            try {
                const viemWalletClient = this.client.wallet as WalletClient
                accounts = await viemWalletClient.getAddresses()
            } catch {
                // Do nothing here - we have the ability to catch the error later
            }
        }

        if (accounts.length === 0) {
            throw new Error("No wallets detected")
        }

        return accounts
    }

}