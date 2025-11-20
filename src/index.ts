// 🧱 DEPENDENCIES
import { Client } from '@/types';
import { Streams } from '@/modules';

// 📤 EXPORTS
// We re-export these to give consumers a "one-stop-shop" for importing types and constants.
export { zeroBytes32 } from '@/constants';
export { SchemaEncoder } from '@/modules';
export { SubscriptionCallback, SubscriptionInitParams } from '@/types/streams';

/**
 * The main entry point for the Somnia SDK.
 * Acts as a Facade to access various sub-modules like Streams.
 */
export class SDK {
  // 🛡️ ARCHITECTURE: 'readonly' prevents consumers from accidentally overwriting 
  // the module instance (e.g., sdk.streams = null), ensuring stability.
  public readonly streams: Streams;

  /**
   * Create a new SDK instance.
   * @param client - Viem wrapper object containing the public client (for reads) and optional wallet client (for writes).
   * @throws Will throw an error if the client is not provided.
   */
  constructor(client: Client) {
    // 🕵️‍♀️ VALIDATION: Fail fast!
    // Ensure the client object exists before trying to initialize modules with it.
    if (!client) {
      throw new Error('SDK requires a valid "Client" object to be initialized.');
    }

    // 🏗️ INITIALIZATION: Dependency Injection
    // We pass the client down to the sub-modules.
    this.streams = new Streams(client);
  }
}
