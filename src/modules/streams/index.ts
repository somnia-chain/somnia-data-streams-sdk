/**
 * Imports
 */
import { Client, KnownContracts } from "@/types"
import { getContractAddressAndAbi } from "@/services/smart-contracts"
import { maybeLogContractError } from "@/services/logs"
import {
    Hex,
    Address,
    Abi,
    toEventSelector,
} from "viem"
import { SchemaDecodedItem, SchemaEncoder } from "./encoder"
import { zeroBytes32 } from "@/constants"
import {
    SchemaReference,
    DataStream,
    EventStream,
    EventSchema,
    SchemaID,
    DataSchemaRegistration,
    StreamsInterface,
    GetSomniaDataStreamsProtocolInfoResponse,
    EventSchemaRegistration,
} from "@/types/streams"
import { assertAddressIsValid } from "@/utils/validation"

import {
    SDK as Reactivity
 } from "@somnia-chain/reactivity"

/**
 * Exports
 */
export {SchemaEncoder} from "./encoder"

export class Streams extends Reactivity implements StreamsInterface {

    constructor(client: Client) {
        super(client)
    }

    /**
     * Adjust the accounts that can emit registered streams event schemas
     * @dev By default, the wallet that registers an event is a defacto emitter but more can be added
     * @dev If one wants the event to be open to all to emit, one could whitelist a smart contract and manage access externally
     * @param streamsEventId Identifier of the registered streams event
     * @param emitter Wallet address
     * @param isEmitter Flag to enable or disable the emitter
     * @returns Transaction hash if successful, Error object if unsuccessful
     */
    public async manageEventEmittersForRegisteredStreamsEvent(
        streamsEventId: string,
        emitter: Address,
        isEmitter: boolean
    ): Promise<Hex | Error> {
        assertAddressIsValid(emitter)
        try {
            // Resolve the chain id based on connected clients
            const chainId = await this.viem.getChainId()

            const {
                address,
                abi
            } = await getContractAddressAndAbi({ 
                internal: KnownContracts.STREAMS,
                chainId 
            })

            const txHash = await this.viem.writeContract(
                address,
                abi!,
                "manageEventEmitter",
                [streamsEventId, emitter, isEmitter]
            )

            if (txHash === null) {
                return new Error("Failed to send transaction - check wallet client")
            }

            return txHash
        } catch (e) {
            maybeLogContractError(e, "Failed to manage event emitter")
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Gives an event registrar the ability to open an event to be emitted by anyone
     * @param streamsEventId Identifier of the registered streams event
     * @param isOpen Enable or disable the feature based on this flag
     * @returns Transaction hash if successful or Error
     */
    public async setIsEventEmissionOpen(
        streamsEventId: string,
        isOpen: boolean
    ): Promise<Hex | Error> {
        try {
            // Resolve the chain id based on connected clients
            const chainId = await this.viem.getChainId()

            const {
                address,
                abi
            } = await getContractAddressAndAbi({ 
                internal: KnownContracts.STREAMS,
                chainId 
            })

            const txHash = await this.viem.writeContract(
                address,
                abi!,
                "setIsEventEmissionOpen",
                [streamsEventId, isOpen]
            )

            if (txHash === null) {
                return new Error("Failed to send transaction - check wallet client")
            }

            return txHash
        } catch (e) {
            maybeLogContractError(e, "Failed to manage event emission")
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Publish on-chain state updates and emit associated events
     * @dev Note that the state will be written to chain before any event(s) is/are emitted
     * @param dataStreams Bytes stream array that has unique keys referencing schemas
     * @param eventStreams Somnia stream event ids and associated arguments to emit EVM logs
     * @returns Transaction hash if successful or Error object
     */
    public async setAndEmitEvents(
        dataStreams: DataStream[],
        eventStreams: EventStream[]
    ): Promise<Hex | Error> {
        try {
            // Resolve the chain id based on connected clients
            const chainId = await this.viem.getChainId()

            const {
                address,
                abi
            } = await getContractAddressAndAbi({ 
                internal: KnownContracts.STREAMS,
                chainId 
            })

            // Apply calldata compression, then write the data stream and event streams to chain
            const txHash = await this.viem.writeContract(
                address,
                abi!,
                "publishDataAndEmitEvents",
                [dataStreams, eventStreams]
            )

            if (txHash === null) {
                return new Error("Failed to send transaction - check wallet client")
            }

            return txHash
        } catch (e) {
            maybeLogContractError(e, "Failed to publish data and emit events")
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Register a set of event schemas that can emit EVM logs later referenced by an arbitrary ID
     * @param registrations Unique event schemas that contain an event topic and a specified number of indexed and non-indexed params
     * @returns Transaction hash if successful or Error
     */
    public async registerEventSchemas(
        registrations: EventSchemaRegistration[]
    ): Promise<Hex | Error> {
        try {
            // Resolve the chain id based on connected clients
            const chainId = await this.viem.getChainId()

            const {
                address,
                abi
            } = await getContractAddressAndAbi({ 
                internal: KnownContracts.STREAMS,
                chainId 
            })

            // Allow for event signatures to be supplied which will then compute the event selector
            const mappedRegistrations: EventSchemaRegistration[] = registrations.map(registration => {
                let updatedTopic = registration.schema.eventTopic
                if (updatedTopic.indexOf("0x") === -1) {
                    updatedTopic = toEventSelector(updatedTopic)
                }
                return {
                    id: registration.id,
                    schema: {
                        params: registration.schema.params,
                        eventTopic: updatedTopic
                    }
                }
            })

            // Fire the register event schema
            const txHash = await this.viem.writeContract(
                address,
                abi!,
                "registerEventSchemas",
                [mappedRegistrations]
            )

            if (txHash === null) {
                return new Error("Failed to send transaction - check wallet client")
            }

            return txHash
        } catch (e) {
            maybeLogContractError(e, "Failed to register event schema")
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Emit EVM event logs on-chain for events that have registered schemas on the Somnia streams protocol
     * @param events Somnia stream event ids and associated arguments to emit EVM logs
     * @returns Transaction hash if successful or Error object
     */
    public async emitEvents(
        events: EventStream[]
    ): Promise<Hex | Error> {
        try {
            // Resolve the chain id based on connected clients
            const chainId = await this.viem.getChainId()
            
            // Fetch the contract address and abi based on the connected chain
            const {
                address,
                abi
            } = await getContractAddressAndAbi({ 
                internal: KnownContracts.STREAMS,
                chainId 
            })

            // Execute the transaction to emit the event schema
            const txHash = await this.viem.writeContract(
                address,
                abi!,
                "emitEvents",
                [events]
            )

            if (txHash === null) {
                return new Error("Failed to send transaction - check wallet client")
            }

            return txHash
        } catch (e) {
            maybeLogContractError(e, "Failed to emit events")
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Compute the bytes32 keccak256 hash of the schema - used as the schema identifier
     * @param schema The solidity compatible schema encoded in a string
     * @returns The bytes32 schema ID or Error
     */
    public async computeSchemaId(schema: string): Promise<Hex | Error> {
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            // Get the schema id
            return this.viem.readContract<Hex>(
                address,
                abi,
                "computeSchemaId",
                [schema]
            )
        } catch (e) {
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Query the contract to check whether a data schema is already registered based on a known schema ID
     * @param schemaId Hex schema ID that is a bytes32 solidity value
     * @returns Boolean denoting registration or Error if it was not possible to register that info
     */
    public async isDataSchemaRegistered(schemaId: SchemaID): Promise<boolean | Error> {
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            // Get the schema id
            return this.viem.readContract<boolean>(
                address,
                abi,
                "isSchemaRegistered",
                [schemaId]
            )
        } catch (e) {
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Total data points published on-chain by a specific wallet for a given schema
     * @param schemaId Unique hex reference to the schema (bytes32 value)
     * @param publisher Address of the wallet or smart contract that published the data
     * @returns An unsigned integer or Error if the information could not be retrieved
     */
    public async totalPublisherDataForSchema(
        schemaId: SchemaID,
        publisher: Address
    ): Promise<bigint | Error> {
        assertAddressIsValid(publisher)
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            // Get the schema id
            return this.viem.readContract<bigint>(
                address,
                abi,
                "totalPublisherDataForSchema",
                [schemaId, publisher]
            )
        } catch (e) {
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Given knowledge re total data published under a schema for a publisher, get data in a specified range
     * @param schemaId Unique hex reference to the schema (bytes32 value)
     * @param publisher Address of the wallet or smart contract that published the data
     * @param startIndex BigInt start of the range (inclusive)
     * @param endIndex BigInt end of the range (exclusive)
     * @returns Raw bytes array if the schema is private, decoded data array if schema is valid, or error
     */
    public async getBetweenRange(
        schemaId: SchemaID,
        publisher: Address,
        startIndex: bigint,
        endIndex: bigint
    ): Promise<Hex[] | SchemaDecodedItem[][] | Error> {
        // Ensure the publisher address is valid
        assertAddressIsValid(publisher)

        // Get data between range
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            // Read from chain with a single multicall call that avoids contractViewCalls.length rpc calls
            const rawData = await this.viem.readContract<Hex[]>(
                address,
                abi,
                "getPublisherDataForSchemaInRange",
                [schemaId, publisher, startIndex, endIndex]
            )

            // Extract the raw data and ask the SDK to deserialise using the data schema specified
            return this.deserialiseRawData(rawData, schemaId)
        } catch (e) {
            maybeLogContractError(e, "getBetweenRange: Failed to get data")
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Read historical published data for a given schema at a known index
     * @param schemaId Unique schema reference that can be computed from the full schema
     * @param publisher Wallet that published the data
     * @param idx Index of the data in an append only list associated with the data publisher wallet
     * @returns Raw data as a hex string if the schema is private, deserialised data or Error if the data does not exist
     */
    public async getAtIndex(
        schemaId: SchemaID,
        publisher: Address,
        idx: bigint
    ): Promise<Hex[] | SchemaDecodedItem[][] | Error> {
        assertAddressIsValid(publisher)
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            // Read from chain
            const rawData = await this.viem.readContract<Hex>(
                address,
                abi,
                "getPublisherDataForSchemaAtIndex",
                [schemaId, publisher, idx]
            )

            return this.deserialiseRawData([rawData], schemaId)
        } catch (e) {
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Fetches the parent schema of another schema which is important metadata when deserialising data associated with a schema that extends a parent schema
     * @param schemaId Hex identifier of the schema being queried
     * @returns A hex value (bytes32) that is fully zero'd if there is no parent or Error if the info cannot be retrieved
     */
    public async parentSchemaId(schemaId: SchemaID): Promise<Hex | Error> {
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            // Get the schema id
            return this.viem.readContract<Hex>(
                address,
                abi,
                "parentSchemaId",
                [schemaId]
            )
        } catch (e) {
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Query the schema name assigned to a schema ID on registration
     * @param schemaId Hex encoded schema ID computed from the raw schema using computeSchemaId
     * @returns The human readable identifier for a schema or Error
     */
    public async schemaIdToSchemaName(schemaId: SchemaID): Promise<string | Error> {
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            // Get the schema id
            return this.viem.readContract<Hex>(
                address,
                abi,
                "schemaIdToName",
                [schemaId]
            )
        } catch (e) {
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Lookup the Hex schema ID for a given schema name assigned at registration
     * @param schemaName Human readable identifier
     * @returns Hex schema id (bytes32 solidity type) or Error
     */
    public async schemaNameToSchemaId(schemaName: string): Promise<SchemaID | Error> {
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            // Get the schema id
            return this.viem.readContract<Hex>(
                address,
                abi,
                "nameToSchemaId",
                [schemaName]
            )
        } catch (e) {
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Batch register multiple schemas that can be used to write state to chain
     * @param registrations Array of raw schemas and any parent schemas associated (if extending a schema)
     * @returns Transaction hash if successful or Error if one is present
     */
    public async registerDataSchemas(
        registrations: DataSchemaRegistration[],
        ignoreRegisteredSchemas?: boolean
    ): Promise<Hex | Error> {
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            let schemasToRegister: DataSchemaRegistration[] = registrations.map(registration => ({
                schemaName: registration.schemaName,
                schema: registration.schema,
                parentSchemaId: (registration.parentSchemaId ? registration.parentSchemaId : zeroBytes32) as Hex
            }))

            if (ignoreRegisteredSchemas) {
                // Perform additional calls to check if the schemas are already registered
                const registrationsWithStatus = await Promise.all(registrations.map(async (registration) => {
                    const computeSchemaIdResult = await this.computeSchemaId(registration.schema)

                    if (computeSchemaIdResult instanceof Error) {
                        return computeSchemaIdResult
                    }

                    const isRegisteredResult = await this.isDataSchemaRegistered(computeSchemaIdResult)
                    if (isRegisteredResult instanceof Error) {
                        return isRegisteredResult
                    }

                    return {
                        schemaName: registration.schemaName,
                        schema: registration.schema,
                        parentSchemaId: (registration.parentSchemaId ? registration.parentSchemaId : zeroBytes32) as Hex,
                        isRegistered: isRegisteredResult
                    }
                }))

                // Filter for only unregistered schemas
                schemasToRegister = registrationsWithStatus
                    .map((registrationResult) => {
                        // Throw any errors encountered
                        if (registrationResult instanceof Error) {
                            throw registrationResult
                        }
                        // otherwise, return the registration info
                        return registrationResult
                    })
                    .filter((registration) => !registration.isRegistered)
                    .map((registration) => ({
                        schemaName: registration.schemaName,
                        schema: registration.schema,
                        parentSchemaId: registration.parentSchemaId
                    }))
            }

            if (schemasToRegister.length === 0) {
                throw new Error("Nothing to register")
            }

            const txHash = await this.viem.writeContract(
                address,
                abi,
                "registerSchemas",
                [schemasToRegister]
            )

            if (txHash === null) {
                return new Error("Failed to send transaction - check wallet client")
            }

            return txHash
        } catch (e) {
            maybeLogContractError(e, "Failed to manage event emitter")
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Write data to chain using data streams that can be parsed by schemas
     * @param dataStreams Bytes stream array that has unique keys referencing schemas
     * @returns Transaction hash or Error
     */
    public async set(
        dataStreams: DataStream[]
    ): Promise<Hex | Error> {
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            // Apply calldata compression, then write the data stream to chain
            const txHash = await this.viem.writeContract(
                address,
                abi,
                "esstores",
                [dataStreams]
            )

            if (txHash === null) {
                return new Error("Failed to send transaction - check wallet client")
            }

            return txHash
        } catch (e) {
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Fetches all raw, registered public schemas that can be used to deserialise data associated with the schema ids
     * @returns Array of full schemas or Error if there was an issue fetching schemas
     */
    public async getAllSchemas(): Promise<string[] | Error> {
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            return this.viem.readContract<string[]>(
                address,
                abi,
                "getAllSchemas"
            )
        } catch (e) {
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Query Somnia Data streams for all data published by a specific wallet for a given schema
     * @param schemaId Unique schema reference to a public or private schema or the full schema
     * @param publisher Wallet that broadcast the data on-chain
     * @returns A hex array with (raw data) for private schemas, SchemaDecodedItem 2D array for decoded data or Error
     */
    public async getAllPublisherDataForSchema(
        schemaId: SchemaID,
        publisher: Address
    ): Promise<Hex[] | SchemaDecodedItem[][] | Error> {
        assertAddressIsValid(publisher)
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            // Read from chain
            const rawData = await this.viem.readContract<Hex[]>(
                address,
                abi,
                "getAllPublisherDataForSchema",
                [schemaId, publisher]
            )

            return this.deserialiseRawData(rawData, schemaId)
        } catch (e) {
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Read state from the Somnia streams protocol that was written via set or setAndEmitEvents
     * @param schemaId Unique hex identifier for the schema associated with the raw data written to chain
     * @param publisher Address of the wallet that wrote the data to chain
     * @param key Unique reference to the data being read
     * @returns The raw data, decoded items or Error
     */
    public async getByKey(
        schemaId: SchemaID,
        publisher: Address,
        key: Hex
    ): Promise<Hex[] | SchemaDecodedItem[][] | Error> {
        assertAddressIsValid(publisher)
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            // Get the index associated with the data key
            const index = await this.viem.readContract<bigint>(
                address,
                abi,
                "publisherDataIndex",
                [schemaId, publisher, key]
            )

            // Due to the contract storing data pointers incremented by one (Solidity limitation)
            // We have to adjust the index to get the correct data
            // We get an array index out of bounds other wise
            const adjustedIndex = index - BigInt(1)

            // Return the data at the adjusted index for a publisher and schema
            return this.getAtIndex(
                schemaId,
                publisher,
                adjustedIndex
            )
        } catch (e) {
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Gets a set of regisered event schemas based on a set of known event schema identifiers assigned at registration
     * @param ids Set of event schema identifiers given to registered event topics
     * @returns Set of event schemas or Error if the data cannot be read from chain
     */
    public async getEventSchemasById(ids: string[]): Promise<EventSchema[] | Error> {
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            return this.viem.readContract<EventSchema[]>(
                address,
                abi,
                "getEventSchemasById",
                [ids]
            )
        } catch (e) {
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * If there published data for a given schema, this returns the last published data
     * @dev this assumes that last published data is at the end of the array of all publisher data points
     * @param schemaId Unique schema identifier
     * @param publisher Address of the wallet or smart contract that wrote to chain
     * @returns Raw data from chain if schema is not public, decoded data if it is or Error if there were errors reading data
     */
    public async getLastPublishedDataForSchema(
        schemaId: SchemaID,
        publisher: Address
    ): Promise<Hex[] | SchemaDecodedItem[][] | Error> {
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            // Read the last published bytes data from chain
            const rawData = await this.viem.readContract<Hex>(
                address,
                abi,
                "getLastPublishedDataForSchema",
                [schemaId, publisher]
            )

            return this.deserialiseRawData([rawData], schemaId)
        } catch (e) {
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Request that the last N data points published by a wallet for a schema are returned
     * @param schemaId Unique schema identifier
     * @param publisher Address of the wallet or smart contract that wrote to chain
     * @param n The total number of recent data to return (dictates the return array size)
     * @returns Raw data from chain if schema is not public, decoded data if it is or Error if there were errors reading data
     */
    public async getLastNPublishedDataForSchema(
        schemaId: SchemaID,
        publisher: Address,
        n: number
    ): Promise<Hex[] | SchemaDecodedItem[][] | Error> {
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            // Read the last published bytes data from chain
            const rawData = await this.viem.readContract<Hex[]>(
                address,
                abi,
                "getLastNPublishedDataForSchema",
                [schemaId, publisher, BigInt(n)]
            )

            return this.deserialiseRawData(rawData, schemaId)
        } catch (e) {
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Based on the connected viem public client, will return the address, abi and connected chain id
     * @returns Protocol info if there is one defined for the target chain or an error if that was not possible
     */
    public async getSomniaDataStreamsProtocolInfo(): Promise<
        GetSomniaDataStreamsProtocolInfoResponse | Error
    > {
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            return {
                address,
                abi,
                chainId
            }
        } catch (e) {
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * From raw bytes data encoded with the schema encoder, deserialise the raw data based on a given public schema
     * @param rawData The array of data that will be deserialised based on the specified schema
     * @param schemaId The bytes32 schema identifier used to lookup the schema that is needed for deserialisation
     * @returns The raw data if the schema is public, the decoded items for each item of raw data or Error if there was an issue
     */
    public async deserialiseRawData(
        rawData: Hex[],
        schemaId: SchemaID
    ): Promise<Hex[] | SchemaDecodedItem[][] | Error> {
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info based on the connected chain
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            // Try to fetch and compute the full schema definition based on the schema ID
            const schemaLookup = await this.schemaLookup(address, abi, schemaId)
            if (schemaLookup instanceof Error) {
                console.log(schemaLookup)
                // Return the raw data without decoding direct from chain since we didn't have a public schema
                return rawData
            }

            // Provided there is a public schema registered on-chain, we can decode the raw bytes
            const encoder = new SchemaEncoder(schemaLookup.finalSchema)
            return rawData.map((raw: Hex) => {
                return encoder.decodeData(raw)
            })
        } catch (e) {
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * Request a schema given the schema id used for data publishing and let the SDK take care of schema extensions
     * @param schemaId The bytes32 unique identifier for a base schema
     * @returns Schema info if it is public, or Error
     */
    public async getSchemaFromSchemaId(
        schemaId: SchemaID
    ): Promise<{
        baseSchema: string
        finalSchema: string
        schemaId: Hex
    } | Error> {
        try {
            // Resolve the connected chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            // Do the base schema lookup and check if the schema has extended other schemas
            const schemaLookup = await this.schemaLookup(
                address,
                abi,
                schemaId
            )
            if (!schemaLookup) {
                throw new Error(`Unable to do schema lookup on [${schemaId}]`)
            }

            return schemaLookup
        } catch (e) {
            if (e instanceof Error) {
                return e
            } else {
                return new Error(String(e))
            }
        }
    }

    /**
     * @dev Internal method that provides a standardised way of computing a full schema definition that factors in inheritence
     * @param streamsProtocol Address of the protocol data schema registry
     * @param abi Protocol application binary interface for interacting with the smart contract
     * @param schemaRef Reference to the base schema which will either be the definition string or the computed bytes32 schema ID
     * @returns Lookup results including the final schema that includes parent schema(s) or an Error if the lookup failed with details
     */
    private async schemaLookup(
        streamsProtocol: Address,
        abi: Abi,
        schemaRef: SchemaReference
    ): Promise<{
        baseSchema: string
        finalSchema: string
        schemaId: Hex
    } | Error> {
        // Ensure there is some data to process
        if (schemaRef.trim().length === 0) {
            throw new Error("Invalid empty schema reference")
        }

        // Lets resolve the schema ID
        // We either have the raw base schema (without the parent schema(s)) or direct schema Id for the base
        let schemaId: Hex | null = null
        let lookupSchemaOnchain = true
        if (schemaRef.indexOf("0x") === -1) {
            // We dont need to do an onchain schema id -> schema look up as we already have the raw schema definition
            // but we still need to compute the schema Id
            const computedSchemaResult = await this.computeSchemaId(schemaRef)
            if (computedSchemaResult instanceof Error) {
                return computedSchemaResult
            }

            // We got a valid schema Id so override the initial value
            schemaId = computedSchemaResult

            // no need to look the schema up on-chain since we have it
            lookupSchemaOnchain = false
        } else if (schemaRef.indexOf("0x") !== -1) {
            schemaId = schemaRef as Hex
        }

        if (!schemaId) {
            return new Error("Schema ID could not be computed for schema")
        }

        // Request info from the chain to see 
        // 1. if the schema is public (the schema definition is known by the data schema lib)
        // 2. if there is a parent schema associated
        const [baseSchemaLookup, parentSchemaId] = await Promise.all([
            lookupSchemaOnchain ? this.viem.readContract<string>(
                streamsProtocol,
                abi,
                "schemaReverseLookup",
                [schemaId]
            ) : Promise.resolve(schemaRef),
            this.viem.readContract<Hex>(
                streamsProtocol,
                abi,
                "parentSchemaId",
                [schemaId]
            ),
        ])

        if (lookupSchemaOnchain && baseSchemaLookup.trim().length === 0) {
            return new Error("Schema is not registered on-chain")
        }

        // Lookup parent schema if the base schema has extended another
        let parentSchema: string | null = null
        if (parentSchemaId !== zeroBytes32) {
            // TODO - this is only handling depth of 1 we need to handle more
            parentSchema = await this.viem.readContract<string>(
                streamsProtocol,
                abi,
                "schemaReverseLookup",
                [parentSchemaId]
            )
        }

        // Compute the final schema factoring in any parent schemas
        let finalSchema = baseSchemaLookup
        if (parentSchema) {
            if (parentSchema.trim().length === 0) {
                return new Error("Invalid parent schema returned from chain: zero data")
            }
            finalSchema = `${finalSchema}, ${parentSchema}`
        }

        if (finalSchema.length === 0) {
            return new Error("Unable to compute final schema")
        }

        // Return the info to be consumed internally and externally
        return {
            baseSchema: baseSchemaLookup,
            finalSchema,
            schemaId
        }
    }

}