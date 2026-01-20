import {
    Hex,
    Address,
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

export type GetSomniaDataStreamsProtocolInfoResponse = {
  address: string
  abi: Abi
  chainId: number
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

    // Protocol
    getSomniaDataStreamsProtocolInfo(): Promise<GetSomniaDataStreamsProtocolInfoResponse | Error>;
}