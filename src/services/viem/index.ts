import {
  Address,
  Abi,
  Account,
  TransactionReceipt,
  getContract as getContractViem,
  WalletClient,
  GetContractReturnType,
  PublicClient,
} from 'viem';
import { ContractAddressAndAbi } from '@/services/smart-contracts';
import { Client } from '@/types';

export class Viem {
  // 🛡️ IMMUTABILITY: Making 'client' readonly prevents accidental swapping 
  // of the client instance which would invalidate the cached chainId.
  readonly client: Client;
  
  // Cache for the chain ID to avoid redundant RPC calls.
  private _chainId: number = 0;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Fetches the Chain ID, using a cached value if available.
   */
  async getChainId(): Promise<number> {
    if (this._chainId === 0) {
      this._chainId = await this.client.public.getChainId();
    }
    return this._chainId;
  }

  /**
   * Returns a contract instance.
   * 🚀 UPGRADE: We inject BOTH public and wallet clients.
   * This creates a "Read-Write" contract instance. You can call write methods 
   * directly on this instance (e.g. contract.write.transfer(...)) without extra setup.
   */
  getContract(contractInfo: ContractAddressAndAbi) {
    return getContractViem({
      address: contractInfo.address,
      abi: contractInfo.abi,
      client: {
        public: this.client.public,
        wallet: this.client.wallet, // Injecting wallet client enables write actions!
      },
    });
  }

  /**
   * Wrapper for reading data from a smart contract.
   */
  async readContract<T>(
    address: Address,
    abi: Abi,
    functionName: string,
    args: unknown[] = []
  ): Promise<T> {
    return this.client.public.readContract({
      address,
      abi,
      functionName,
      args,
    }) as Promise<T>;
  }

  /**
   * Wrapper for writing data to a smart contract.
   * 🛡️ ERROR HANDLING: Throws explicit errors instead of returning null.
   */
  async writeContract(
    address: Address,
    abi: Abi,
    functionName: string,
    args: unknown[] = [],
    value: bigint = 0n // ⚡ SYNTAX: Using 0n is cleaner than BigInt(0)
  ) {
    if (!this.client.wallet) {
      throw new Error('Write operation failed: No wallet client connected.');
    }

    // 🧠 SMART ACCOUNT RESOLUTION:
    // If the wallet client has a hoisted Local Account (private key), use it.
    // Otherwise, pass 'null' explicitly to let the Transport (e.g. Browser Extension) handle it.
    const account = this.client.wallet.account ?? null;

    return this.client.wallet.writeContract({
      address,
      abi,
      functionName,
      args,
      value,
      account, 
      chain: this.client.wallet.chain,
    });
  }

  async waitForTransaction(hash: `0x${string}`): Promise<TransactionReceipt> {
    return this.client.public.waitForTransactionReceipt({
      hash,
    });
  }

  /**
   * Retrieves available accounts from the connected wallet.
   * Handles both Local Accounts (private keys) and JSON-RPC Accounts (extensions).
   */
  async getCurrentAccounts(): Promise<Address[]> {
    if (!this.client.wallet) {
      throw new Error('No wallet client initialized');
    }

    // 1. Priority: Local Account (e.g. Private Key / Mnemonic initialized wallet)
    // If this exists, we don't need to query the RPC.
    if (this.client.wallet.account) {
      return [this.client.wallet.account.address];
    }

    // 2. Fallback: JSON-RPC Account (e.g. MetaMask, WalletConnect)
    // We need to ask the provider for permissions/accounts.
    try {
      // ⚡ TYPE SAFETY: Explicitly cast to WalletClient to access getAddresses
      const viemWalletClient = this.client.wallet as WalletClient;
      const accounts = await viemWalletClient.getAddresses();
      
      if (accounts.length === 0) {
        throw new Error('Wallet connected but no accounts accessible.');
      }
      
      return accounts;
    } catch (error) {
      // Bubble up the error with context, rather than swallowing it.
      throw new Error(`Failed to fetch accounts: ${(error as Error).message}`);
    }
  }
}
