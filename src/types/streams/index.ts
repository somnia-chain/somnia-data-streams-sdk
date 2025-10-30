import {
    Hex,
    Address,
    webSocket,
    Abi,
} from "viem"
import { SchemaDecodedItem } from "@/modules/streams/encoder"

export type EventParameter = {
    name: string
    paramType: string
    isIndexed: boolean
}

export type EventSchema = {
    params: EventParameter[]
    eventTopic: Hex | string
}

export type EventStream = {
    id: string
    argumentTopics: Hex[]
    data: Hex
}

export type DataStream = {
    id: Hex
    schemaId: Hex
    data: Hex
}

/**
 * Arguments for registering a data schema
 * @dev parentSchemaId is a bytes32. bytes32(0) is equivalent to not supplying a parent schema ID
 * @param id Human readible identifer for schemas
 * @param schema Raw CSV string containing solidity value types
 * @param parentSchemaId Optional reference to parent schema identifier when extending schemas
 */
export type DataSchemaRegistration = {
    id: string
    schema: string
    parentSchemaId?: Hex
}

export type LiteralSchema = string
export type SchemaID = Hex
export type SchemaReference = LiteralSchema | SchemaID

// Define types for the custom filter
export type LogTopic = Hex | Hex[] | null;

export type EthCall = {
    from?: Address,
    to: Address,
    gas?: Hex,
    gasPrice?: Hex,
    value?: Hex,
    data?: Hex
}

export type SomniaWatchFilter = {
  address?: Address | Address[];
  topics?: LogTopic[];
  eth_calls?: EthCall[];
  context?: string;
  push_changes_only?: boolean;
};

export type SuccessResult<result> = {
  method?: undefined
  result: result
  error?: undefined
}

export type ErrorResult<error> = {
  method?: undefined
  result?: undefined
  error: error
}

export type Subscription<result, error> = {
  method: 'eth_subscription'
  error?: undefined
  result?: undefined
  params:
    | {
        subscription: string
        result: result
        error?: undefined
      }
    | {
        subscription: string
        result?: undefined
        error: error
      }
}

export type RpcResponse<result = any, error = any> = {
  jsonrpc: `${number}`
  id: number
} & (SuccessResult<result> | ErrorResult<error> | Subscription<result, error>)

export type WebSocketTransportSubscribeParameters = {
  onData: (data: RpcResponse) => void
  onError?: ((error: any) => void) | undefined
}

export type WebSocketTransportSubscribeReturnType = {
  subscriptionId: Hex
  unsubscribe: () => Promise<RpcResponse<boolean>>
}

// Define the extended subscribe type with overloads (multiple call signatures)
export type ExtendedSubscribe = {
  (args: WebSocketTransportSubscribeParameters & { params: ["newHeads"] }): Promise<WebSocketTransportSubscribeReturnType>;
  (args: WebSocketTransportSubscribeParameters & { params: ["newPendingTransactions"] }): Promise<WebSocketTransportSubscribeReturnType>;
  (args: WebSocketTransportSubscribeParameters & { params: ["logs", { address?: Address | Address[]; topics?: LogTopic[]; }] }): Promise<WebSocketTransportSubscribeReturnType>;
  (args: WebSocketTransportSubscribeParameters & { params: ["syncing"] }): Promise<WebSocketTransportSubscribeReturnType>;
  (args: WebSocketTransportSubscribeParameters & { params: ["somnia_watch", SomniaWatchFilter] }): Promise<WebSocketTransportSubscribeReturnType>;
}

export type ExtendedWebSocketTransport = Omit<ReturnType<typeof webSocket>, 'subscribe'> & {
  subscribe: ExtendedSubscribe;
}

export type SubscriptionCallback = {
  result: {
    topics: Hex[],
    data: Hex,
    simulationResults: Hex[]
  }
}

export type GetSomniaDataStreamsProtocolInfoResponse = {
  address: string
  abi: Abi
  chainId: number
}

/**
 * @param somniaStreamsEventId The identifier of a registered event schema within Somnia streams protocol or null if using a custom event source
 * @param ethCalls Fixed set of ETH calls that must be executed before onData callback is triggered. Multicall3 is recommended. Can be an empty array
 * @param context Event sourced selectors to be added to the data field of ETH calls, possible values: topic0, topic1, topic2, topic3, topic4, data and address
 * @param onData Callback for a successful reactivity notification
 * @param onError Callback for a failed attempt 
 * @param eventContractSource Alternative contract event source (any on somnia) that will be emitting the logs specified by topicOverrides
 * @param topicOverrides Optional when using Somnia streams as an event source but mandatory when using a different event source
 * @param onlyPushChanges Whether the data should be pushed to the subscriber only if eth_call results are different from the previous
 */
export type SubscriptionInitParams = {
    somniaStreamsEventId?: string
    ethCalls: EthCall[]
    context?: string
    onData: (data: any) => void
    onError?: (error: Error) => void
    eventContractSource?: Address
    topicOverrides?: Hex[]
    onlyPushChanges: boolean
}

export interface StreamsInterface {
    // Write
    set(d: DataStream[]): Promise<Hex | null>;
    emitEvents(e: EventStream[]): Promise<Hex | Error | null>;
    setAndEmitEvents(d: DataStream[], e: EventStream[]): Promise<Hex | Error | null>;

    // Manage
    registerDataSchemas(registrations: DataSchemaRegistration[]): Promise<Hex | Error | null>;
    registerEventSchemas(ids: string[], schemas: EventSchema[]): Promise<Hex | Error | null>;
    manageEventEmittersForRegisteredStreamsEvent(
        streamsEventId: string,
        emitter: Address,
        isEmitter: boolean
    ): Promise<Hex | Error | null>;

    // Read
    getByKey(schemaId: SchemaID, publisher: Address, key: Hex): Promise<Hex[] | SchemaDecodedItem[][] | null>;
    getAtIndex(schemaId: SchemaID, publisher: Address, idx: bigint): Promise<Hex[] | SchemaDecodedItem[][] | null>;
    getBetweenRange(
        schemaId: SchemaID,
        publisher: Address,
        startIndex: bigint,
        endIndex: bigint
    ): Promise<Hex[] | SchemaDecodedItem[][] | Error | null>;
    getAllPublisherDataForSchema(
        schemaReference: SchemaReference,
        publisher: Address
    ): Promise<Hex[] | SchemaDecodedItem[][] | null>;
    getLastPublishedDataForSchema(
        schemaId: SchemaID,
        publisher: Address
    ): Promise<Hex[] | SchemaDecodedItem[][] | null>;
    totalPublisherDataForSchema(schemaId: SchemaID, publisher: Address): Promise<bigint | null>;
    isDataSchemaRegistered(schemaId: SchemaID): Promise<boolean | null>;
    computeSchemaId(schema: string): Promise<Hex | null>;
    parentSchemaId(schemaId: SchemaID): Promise<Hex | null>;
    schemaIdToId(schemaId: SchemaID): Promise<string | null>;
    idToSchemaId(id: string): Promise<Hex | null>;
    getAllSchemas(): Promise<string[] | null>;
    getEventSchemasById(ids: string[]): Promise<EventSchema[] | null>;

    // Helper
    deserialiseRawData(
        rawData: Hex[],
        parentSchemaId: Hex,
        schemaLookup: {
            schema: string;
            schemaId: Hex;
        } | null
    ): Promise<Hex[] | SchemaDecodedItem[][] | null>;

    // Subscribe
    subscribe(initParams: SubscriptionInitParams): Promise<{ subscriptionId: string, unsubscribe: () => void } | undefined>;

    // Protocol
    getSomniaDataStreamsProtocolInfo(): Promise<GetSomniaDataStreamsProtocolInfoResponse | Error | null>;
}