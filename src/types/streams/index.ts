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

export type EventSchemaRegistration = {
    id: string
    schema: EventSchema
}

export type DataStream = {
    id: Hex
    schemaId: Hex
    data: Hex
}

/**
 * Arguments for registering a data schema
 * @dev parentSchemaId is a bytes32. bytes32(0) is equivalent to not supplying a parent schema ID
 * @param schemaName Human readible name associated with a data schema
 * @param schema Raw CSV string containing solidity value types
 * @param parentSchemaId Optional reference to parent schema identifier when extending schemas
 */
export type DataSchemaRegistration = {
    schemaName: string
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
 * @param eventContractSources Alternative contract event source(s) (any on somnia) that will be emitting the logs specified by topicOverrides
 * @param topicOverrides Optional when using Somnia streams as an event source but mandatory when using a different event source
 * @param onlyPushChanges Whether the data should be pushed to the subscriber only if eth_call results are different from the previous
 */
export type SubscriptionInitParams = {
    somniaStreamsEventId?: string
    ethCalls: EthCall[]
    context?: string
    onData: (data: any) => void
    onError?: (error: Error) => void
    eventContractSources?: Address[]
    topicOverrides?: Hex[]
    onlyPushChanges: boolean
}

export interface StreamsInterface {
    // Write
    set(d: DataStream[]): Promise<Hex | Error>;
    emitEvents(e: EventStream[]): Promise<Hex | Error>;
    setAndEmitEvents(d: DataStream[], e: EventStream[]): Promise<Hex | Error>;

    // Manage
    registerDataSchemas(registrations: DataSchemaRegistration[], ignoreRegisteredSchemas?: boolean): Promise<Hex | Error>;
    registerEventSchemas(registrations: EventSchemaRegistration[]): Promise<Hex | Error>;
    manageEventEmittersForRegisteredStreamsEvent(
        streamsEventId: string,
        emitter: Address,
        isEmitter: boolean
    ): Promise<Hex | Error>;

    // Read
    getByKey(schemaId: SchemaID, publisher: Address, key: Hex): Promise<Hex[] | SchemaDecodedItem[][] | Error>;
    getAtIndex(schemaId: SchemaID, publisher: Address, idx: bigint): Promise<Hex[] | SchemaDecodedItem[][] | Error>;
    getBetweenRange(
        schemaId: SchemaID,
        publisher: Address,
        startIndex: bigint,
        endIndex: bigint
    ): Promise<Hex[] | SchemaDecodedItem[][] | Error>;
    getAllPublisherDataForSchema(
        schemaReference: SchemaReference,
        publisher: Address
    ): Promise<Hex[] | SchemaDecodedItem[][] | Error>;
    getLastPublishedDataForSchema(
        schemaId: SchemaID,
        publisher: Address
    ): Promise<Hex[] | SchemaDecodedItem[][] | Error>;
    totalPublisherDataForSchema(schemaId: SchemaID, publisher: Address): Promise<bigint | Error>;
    isDataSchemaRegistered(schemaId: SchemaID): Promise<boolean | Error>;
    computeSchemaId(schema: string): Promise<Hex | Error>;
    parentSchemaId(schemaId: SchemaID): Promise<Hex | Error>;
    schemaIdToSchemaName(schemaId: SchemaID): Promise<string | Error>;
    schemaNameToSchemaId(schemaName: string): Promise<SchemaID | Error>;
    getAllSchemas(): Promise<string[] | Error>;
    getEventSchemasById(ids: string[]): Promise<EventSchema[] | Error>;
    getSchemaFromSchemaId(
        schemaId: SchemaID
    ): Promise<{
        baseSchema: string
        finalSchema: string
        schemaId: Hex
    } | Error>;

    // Helper
    deserialiseRawData(
        rawData: Hex[],
        schemaId: Hex,
        decompress: boolean
    ): Promise<Hex[] | SchemaDecodedItem[][] | Error>;

    // Subscribe
    subscribe(initParams: SubscriptionInitParams): Promise<WebSocketTransportSubscribeReturnType | Error>;

    // Protocol
    getSomniaDataStreamsProtocolInfo(): Promise<GetSomniaDataStreamsProtocolInfoResponse | Error>;
}