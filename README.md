# 🚀 Somnia Data Streams TypeScript SDK

The Somnia Data Streams TypeScript SDK enables streaming data on-chain, integrated with off-chain reactivity to unlock new paradigms in the blockchain ecosystem. SDKs for other languages to follow.

## 🔒 Key abtractions

The SDK uses `viem` to abstract away RPC providers, wallets, and on-chain transactions.

- For read-only access, provide just a public client—the SDK handles contract setup for Somnia testnet or mainnet.
- For transactions, add any wallet client: private key-based, remote signer, ERC-4337 AA, etc.

## 🚀 Getting Started

### 📦 Installation

Example with `npm`:

```bash
npm i @somnia-chain/streams
```

However, feel free to use alternatives like `pnpm`
```bash
pnpm add @somnia-chain/streams
```

### 🔌 Connecting to the SDK

You'll need `viem` installed for the public and or wallet client. Install it with `npm i viem`.

```typescript
import { createPublicClient, createWalletClient, http, defineChain } from 'viem'
import { SDK } from '@somnia-chain/streams'

// Example: Public client (required for reading data)
const chain = defineChain() // see viem docs for defining somnia
const publicClient = createPublicClient({
  chain, 
  transport: http(),
})

// Optional: Wallet client for writes
const walletClient = createWalletClient({
  account,
  chain,
  transport: http(),
})

const sdk = new SDK({
  public: publicClient,
  wallet: walletClient, // Omit if read-only
})
```

### 📡 Activating Off-Chain Reactivity (Subscriptions)

Use WebSocket subscriptions for real-time updates. Define params and subscribe—the SDK handles the rest via WebSockets.

```typescript
import { SDK, SubscriptionInitParams, SubscriptionCallback } from '@somnia-chain/streams'

// Example params
const initParams: SubscriptionInitParams = {
  ethCalls: [], // Multicall3 recommended; can be empty
  context: 'data', // e.g., 'topic0', 'data', 'address'
  onData: (data: SubscriptionCallback) => console.log('Received:', data),
  onlyPushChanges: true, // Push only if data changes
}

const subscription = await sdk.streams.subscribe(initParams)

// Later, unsubscribe when done
subscription.unsubscribe()
```

### 📤 Emitting Data and Triggering Subscriptions

To emit data that triggers subscribers' `onData` callbacks:

```typescript
// Pseudo-code example (see docs for full ABI/details)
const dataStreams = [{
    id: toHex(`44-7`, { size: 32 }),
    schemaId: driverSchemaId,
    data: encodedData
}]

const eventStreams = [{
    id: 'your-event-id',
    argumentTopics: topics.slice(1),
    data: data
}]

await sdk.streams.setAndEmitEvents(dataStreams, eventStreams)

// This on-chain emission triggers off-chain reactivity:
// Subscribers with matching eventId get onData called with the new data.
```

## 📚 Full Data Streams Documentation

For detailed event schemas, advanced usage, and more examples, check the [Somnia Data Streams Docs](https://docs.somnia.network/developer/development-workflow/somnia-data-streams).