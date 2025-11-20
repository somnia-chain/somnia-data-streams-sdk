# 🚀 Somnia Data Streams TypeScript SDK

The Somnia Data Streams TypeScript SDK enables streaming data on-chain, integrated with off-chain reactivity to unlock new paradigms in the blockchain ecosystem. SDKs for other languages to follow.

## 🔒 Key **abstractions**
**_(1. Yazım Hatası Giderildi)_**

The SDK uses `viem` to abstract away RPC providers, wallets, and on-chain transactions.

- For read-only access, provide just a public client—the SDK handles contract setup for Somnia testnet or mainnet.
- For transactions, add any wallet client: private key-based, remote signer, ERC-4337 AA, etc.

## 🚀 Getting Started

### 📦 Installation

Example with `npm`:

```bash
pnpm add @somnia-chain/streams
import { 
  createPublicClient, 
  createWalletClient, 
  http, 
  defineChain,
  privateKeyToAccount // Tanımlama için eklendi
} from 'viem'
import { SDK } from '@somnia-chain/streams'

// Example: Public client (required for reading data)
const chain = defineChain() // see viem docs for defining somnia
const publicClient = createPublicClient({
  chain, 
  transport: http(),
})

// Optional: Wallet client for writes
// NOTE: Güvenliğiniz için bu anahtarı gerçek bir uygulamada ortam değişkenlerinden yükleyin.
const privateKey = '0x...' // Örnek placeholder
const account = privateKeyToAccount(privateKey) // 3. Teknik Hata Giderildi: 'account' değişkeni tanımlandı
const walletClient = createWalletClient({
  account, 
  chain,
  transport: http(),
})

const sdk = new SDK({
  public: publicClient,
  wallet: walletClient, // Omit if read-only
})
import { SDK, SubscriptionInitParams, SubscriptionCallback } from '@somnia-chain/streams'

// Example params
const initParams: SubscriptionInitParams = {
  somniaStreamsEventId: 'your-event-id', // Or null for custom
  ethCalls: [], // Multicall3 recommended; can be empty
  context: 'data', // e.g., 'topic0', 'data', 'address'
  onData: (data: SubscriptionCallback) => console.log('Received:', data),
  onlyPushChanges: true, // Push only if data changes
}

const subscription = await sdk.streams.subscribe(initParams)

// Later, unsubscribe when done
subscription.unsubscribe()
// Pseudo-code example (see docs for full ABI/details)
// 'driverSchemaId', 'encodedData', 'topics' değişkenlerinin tanımlı olduğu varsayılır.
const dataStreams = [{
    id: toHex(`44-7`, { size: 32 }), // Could be crossing the finish line etc
    schemaId: driverSchemaId,
    data: encodedData
}]

const encodedEventData = '0x...' // 4. Teknik Hata Giderildi: eventStreams için placeholder veri tanımı yapıldı

const eventStreams = [{
    id: 'your-event-id',
    argumentTopics: topics.slice(1),
    data: encodedEventData // Tanımlanan değişken kullanıldı
}]

await sdk.streams.setAndEmitEvents(dataStreams, eventStreams)

// This on-chain emission triggers off-chain reactivity:
// Subscribers with matching eventId get onData called with the new data.
