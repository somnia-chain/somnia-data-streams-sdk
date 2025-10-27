/**
 * Imports
 */
import { Client, KnownContracts } from "@/types"
import { Viem } from "@/services/viem"
import { getContractAddressAndAbi } from "@/services/smart-contracts"
import { maybeLogContractError } from "@/services/logs"
import {
    Hex,
    Address,
    Abi,
    createPublicClient,
    webSocket,
    toEventSelector,
    isAddressEqual,
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
    ExtendedWebSocketTransport,
    StreamsInterface,
    SubscriptionInitParams,
} from "@/types/streams"
import { assertAddressIsValid } from "@/utils/validation"

/**
 * Exports
 */
export {SchemaEncoder} from "./encoder"

export class Streams implements StreamsInterface {
    private viem: Viem

    constructor(client: Client) {
        this.viem = new Viem(client)
    }

    /**
     * Adjust the accounts that can emit registered streams event schemas
     * @dev By default, the wallet that registers an event is a defacto emitter but more can be added
     * @dev If one wants the event to be open to all to emit, one could whitelist a smart contract and manage access externally
     * @param streamsEventId Identifier of the registered streams event
     * @param emitter Wallet address
     * @param isEmitter Flag to enable or disable the emitter
     * @returns Transaction hash if successful, Error object where applicable or null in catch all error case
     */
    public async manageEventEmittersForRegisteredStreamsEvent(
        streamsEventId: string,
        emitter: Address,
        isEmitter: boolean
    ): Promise<Hex | Error | null> {
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

            return this.viem.writeContract(
                address,
                abi!,
                "manageEventEmitter",
                [streamsEventId, emitter, isEmitter]
            )
        } catch (e) {
            console.log("manageEventEmitter failure", e)
            maybeLogContractError(e, "Failed to manage event emitter")
            if (e instanceof Error) {
                return e
            }
        }
        return null
    }

    /**
     * Publish on-chain state updates and emit associated events
     * @dev Note that the state will be written to chain before any event(s) is/are emitted
     * @param dataStreams Bytes stream array that has unique keys referencing schemas
     * @param eventStreams Somnia stream event ids and associated arguments to emit EVM logs
     * @returns Transaction hash if successful, Error object where applicable or null in catch all error case
     */
    public async setAndEmitEvents(
        dataStreams: DataStream[],
        eventStreams: EventStream[]
    ): Promise<Hex | Error | null> {
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

            return this.viem.writeContract(
                address,
                abi!,
                "publishDataAndEmitEvents",
                [dataStreams, eventStreams]
            )
        } catch (e) {
            console.log("publishDataAndEmitEvents failure", e)
            maybeLogContractError(e, "Failed to publish data and emit events")
            if (e instanceof Error) {
                return e
            }
        }
        return null
    }

    /**
     * Register a set of event schemas that can emit EVM logs later referenced by an arbitrary ID
     * @param ids Arbirary identifiers that will be asigned to event schmas
     * @param schemas Unique event schemas that contain an event topic and a specified number of indexed and non-indexed params
     * @returns Transaction hash if successful, Error object where applicable or null in catch all error case
     */
    public async registerEventSchemas(
        ids: string[],
        schemas: EventSchema[]
    ): Promise<Hex | Error | null> {
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
            const schemasToRegister: EventSchema[] = schemas.map(schema => {
                let updatedTopic = schema.eventTopic
                if (updatedTopic.indexOf("0x") === -1) {
                    updatedTopic = toEventSelector(updatedTopic)
                }
                return {
                    params: schema.params,
                    eventTopic: updatedTopic
                }
            })

            // Fire the register event schema
            return this.viem.writeContract(
                address,
                abi!,
                "registerEventSchemas",
                [ids, schemasToRegister]
            )
        } catch (e) {
            console.log("registerEventSchemas failure", e)
            maybeLogContractError(e, "Failed to register event schema")
            if (e instanceof Error) {
                return e
            }
        }
        return null
    }

    /**
     * Emit EVM event logs on-chain for events that have registered schemas on the Somnia streams protocol
     * @param events Somnia stream event ids and associated arguments to emit EVM logs
     * @returns Transaction hash if successful, Error object where applicable or null in catch all error case
     */
    public async emitEvents(
        events: EventStream[]
    ): Promise<Hex | Error | null> {
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
            return this.viem.writeContract(
                address,
                abi!,
                "emitEvents",
                [events]
            )
        } catch (e) {
            console.log("emitEvents failure", e)
            maybeLogContractError(e, "Failed to emit events")
            if (e instanceof Error) {
                return e
            }
        }
        return null
    }

    /**
     * Compute the bytes32 keccak256 hash of the schema - used as the schema identifier
     * @param schema The solidity compatible schema encoded in a string
     * @returns The bytes32 schema ID
     */
    public async computeSchemaId(schema: string): Promise<Hex | null> {
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
            console.error(e)
        }
        return null
    }

    /**
     * Query the contract to check whether a data schema is already registered based on a known schema ID
     * @param schemaId Hex schema ID that is a bytes32 solidity value
     * @returns Boolean denoting registration or null if it was not possible to register that info
     */
    public async isDataSchemaRegistered(schemaId: SchemaID): Promise<boolean | null> {
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
            console.error(e)
        }
        return null
    }

    /**
     * Total data points published on-chain by a specific wallet for a given schema
     * @param schemaId Unique hex reference to the schema (bytes32 value)
     * @param publisher Address of the wallet or smart contract that published the data
     * @returns An unsigned integer or null if the information could not be retrieved
     */
    public async totalPublisherDataForSchema(
        schemaId: SchemaID,
        publisher: Address
    ): Promise<bigint | null> {
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
            console.error(e)
        }
        return null
    }

    /**
     * Read historical published data for a given schema at a known index
     * @param schemaId Unique schema reference that can be computed from the full schema
     * @param publisher Wallet that published the data
     * @param idx Index of the data in an append only list associated with the data publisher wallet
     * @returns Raw data as a hex string if the schema is private, deserialised data or null if the data does not exist
     */
    public async getAtIndex(
        schemaId: SchemaID,
        publisher: Address,
        idx: bigint
    ): Promise<Hex[] | SchemaDecodedItem[][] | null> {
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
            let [rawData, parentSchemaId] = await Promise.all([
                // Read the raw published data regardless
                this.viem.readContract<Hex>(
                    address,
                    abi,
                    "getPublisherDataForSchemaAtIndex",
                    [schemaId, publisher, idx]
                ),
                // Check if there is a parent schema id associated with the schema
                this.viem.readContract<Hex>(
                    address,
                    abi,
                    "parentSchemaId",
                    [schemaId]
                ),
            ])

            // Do the schema lookup
            const schemaLookup = await this.localAndOnchainSchemaLookup(
                address,
                abi,
                schemaId
            )
            if (!schemaLookup) {
                throw new Error(`Unable to do schema lookup on [${schemaId}]`)
            }

            return this.deserialiseRawData([rawData], parentSchemaId, schemaLookup)
        } catch (e) {
            console.error(e)
        }
        return null
    }

    /**
     * Fetches the parent schema of another schema which is important metadata when deserialising data associated with a schema that extends a parent schema
     * @param schemaId Hex identifier of the schema being queried
     * @returns A hex value (bytes32) that is fully zero'd if there is no parent or null if the info cannot be retrieved
     */
    public async parentSchemaId(schemaId: SchemaID): Promise<Hex | null> {
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
            console.error(e)
        }
        return null
    }

    /**
     * Query the unique human readable identifier for a schema
     * @param schemaId Hex encoded schema ID computed from the raw schema using computeSchemaId
     * @returns The human readable identifier for a schema
     */
    public async schemaIdToId(schemaId: SchemaID): Promise<string | null> {
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
                "schemaIdToId",
                [schemaId]
            )
        } catch (e) {
            console.error(e)
        }
        return null
    }

    /**
     * Lookup the Hex schema ID for a given unique human readable identifer
     * @param id Human readable identifier
     * @returns Hex schema id (bytes32 solidity type)
     */
    public async idToSchemaId(id: string): Promise<Hex | null> {
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
                "idToSchemaId",
                [id]
            )
        } catch (e) {
            console.error(e)
        }
        return null
    }

    /**
     * Batch register multiple schemas that can be used to write state to chain
     * @param registrations Array of raw schemas and any parent schemas associated (if extending a schema)
     * @returns Transaction hash if successful, Error if one is present or null if something failed
     */
    public async registerDataSchemas(
        registrations: DataSchemaRegistration[]
    ): Promise<Hex | Error | null> {
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            return this.viem.writeContract(
                address,
                abi,
                "registerSchemas",
                [registrations.map(registration => ({
                    id: registration.id,
                    schema: registration.schema,
                    parentSchemaId: registration.parentSchemaId ? registration.parentSchemaId : zeroBytes32
                }))]
            )
        } catch (e) {
            console.log("manageEventEmitter failure", e)
            maybeLogContractError(e, "Failed to manage event emitter")
            if (e instanceof Error) {
                return e
            }
        }
        return null
    }

    /**
     * Write data to chain using data streams that can be parsed by schemas
     * @param dataStreams Bytes stream array that has unique keys referencing schemas
     * @returns Transaction hash or null if there are issues writing to chain
     */
    public async set(
        dataStreams: DataStream[]
    ): Promise<Hex | null> {
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            return this.viem.writeContract(
                address,
                abi,
                "esstores",
                [dataStreams]
            )
        } catch (e) {
            console.error(e)
        }
        return null
    }

    /**
     * Fetches all raw, registered public schemas that can be used to deserialise data associated with the schema ids
     * @returns Array of full schemas or null if there was an issue fetching schemas
     */
    public async getAllSchemas(): Promise<string[] | null> {
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
            console.error(e)
        }
        return null
    }

    /**
     * Query Etherbase for all data published by a specific wallet for a given schema
     * @param schemaId Unique schema reference to a public or private schema or the full schema
     * @param publisher Wallet that broadcast the data on-chain
     * @returns A hex array with (raw data) for private schemas, SchemaDecodedItem 2D array for decoded data or null for errors reading from chain
     */
    public async getAllPublisherDataForSchema(
        schemaReference: SchemaReference,
        publisher: Address
    ): Promise<Hex[] | SchemaDecodedItem[][] | null> {
        assertAddressIsValid(publisher)
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            // Do the schema lookup
            const schemaLookup = await this.localAndOnchainSchemaLookup(
                address,
                abi,
                schemaReference
            )
            if (!schemaLookup) {
                throw new Error(`Unable to do schema lookup on [${schemaReference}]`)
            }

            // Read from chain
            let [rawData, parentSchemaId] = await Promise.all([
                // Read the raw published data regardless
                this.viem.readContract<Hex[]>(
                    address,
                    abi,
                    "getAllPublisherDataForSchema",
                    [schemaLookup.schemaId, publisher]
                ),
                // Check if there is a parent schema id associated with the schema
                this.viem.readContract<Hex>(
                    address,
                    abi,
                    "parentSchemaId",
                    [schemaLookup.schemaId]
                ),
            ])

            return this.deserialiseRawData(rawData, parentSchemaId, schemaLookup)
        } catch (e) {
            console.error(e)
        }
        return null
    }

    /**
     * Read state from the Somnia streams protocol that was written via set or setAndEmitEvents
     * @param schemaId Unique hex identifier for the schema associated with the raw data written to chain
     * @param publisher Address of the wallet that wrote the data to chain
     * @param key Unique reference to the data being read
     * @returns The raw data
     */
    public async getByKey(
        schemaId: SchemaID,
        publisher: Address,
        key: Hex
    ): Promise<Hex[] | SchemaDecodedItem[][] | null> {
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

            return this.getAtIndex(
                schemaId,
                publisher,
                index
            )
        } catch (e) {
            console.error(e)
        }
        return null
    }

    /**
     * Gets a set of regisered event schemas based on a set of known event schema identifiers assigned at registration
     * @param ids Set of event schema identifiers given to registered event topics
     * @returns Set of event schemas or null if the data cannot be read from chain
     */
    public async getEventSchemasById(ids: string[]): Promise<EventSchema[] | null> {
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
            console.log(e)
        }
        return null
    }

    /**
     * Somnia streams reactivity enabling event subscriptions that bundle any ETH call data
     * @param param0 See SubscriptionInitParams type which defines the events being observed, the eth calls executed and what callback fn to call
     * @returns The subscription identifier and an unsubscribe callback or undefined if the subscription fails to start
     */
    public async subscribe({
        somniaStreamsEventId,
        ethCalls,
        context,
        onData,
        onError,
        eventContractSource,
        topicOverrides,
        onlyPushChanges
    }: SubscriptionInitParams): Promise<{ subscriptionId: string, unsubscribe: () => void } | undefined> {
        try {
            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the streams contract address as the default event source
            const { address: streamsProtocolAddress } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            // Ensure the transport type is websocket otherwise we cannot proceed
            if (this.viem.client.public.transport.type !== "webSocket") {
                throw new Error("Invalid public client config - websocket required")
            }

            // If an override for event source has been specified use it otherwise use the Streams contract address
            const eventSource: Address = eventContractSource ? eventContractSource : streamsProtocolAddress
            assertAddressIsValid(eventSource)

            let eventTopics: Hex[] = []
            if (isAddressEqual(eventSource, streamsProtocolAddress)) {
                // the default event source is being used but lets check if more than 1 topic has been supplied
                if (!topicOverrides || topicOverrides.length === 0) {
                    if (!somniaStreamsEventId) {
                        throw new Error("Somnia streams event ID must be specified")
                    }

                    // Fetch the topic info from the streams contract by id
                    const eventSchemas = await this.getEventSchemasById([somniaStreamsEventId])
                    if (!eventSchemas) {
                        throw new Error("Failed to get the event schema")
                    }
                    if (eventSchemas.length < 1) {
                        throw new Error("No event schema returned")
                    }
                    if (eventSchemas.length > 1) {
                        throw new Error("Too many schemas found")
                    }
                    const [eventSchema] = eventSchemas
                    const { eventTopic } = eventSchema

                    // Push a single topic for us to watch
                    eventTopics.push(eventTopic as Hex)
                } else {
                    eventTopics = topicOverrides
                }
            } else {
                if (!topicOverrides) {
                    throw new Error("Specified event contract source but no event topic specified")
                }
                eventTopics = topicOverrides
            }

            // get a public client with the correct websocket types already figured out
            const webSocketClient = createPublicClient({
                chain: this.viem.client.public.chain,
                transport: webSocket(),  // Defaults to chain's WS URL
            }) as unknown as { transport: ExtendedWebSocketTransport };

            // Subscribe and return the subscription info to the caller
            return webSocketClient.transport.subscribe({
                params: [
                    "somnia_watch",
                    {
                        address: eventSource,
                        topics: eventTopics,
                        eth_calls: ethCalls,
                        context,
                        push_changes_only: onlyPushChanges
                    }
                ],
                onData,
                onError
            })
        } catch (e) {
            console.log(e)
        }
    }

    private async localAndOnchainSchemaLookup(
        contract: Address,
        abi: Abi,
        schemaRef: SchemaReference
    ): Promise<{
        schema: string,
        schemaId: Hex
    } | null> {
        if (typeof schemaRef === "string"
                && schemaRef.indexOf("0x") === -1
                && schemaRef.indexOf("0X") === -1
            ) {
            // we dont need to do an onchain schema id -> schema look up as we already have the schema
            // but we should still compute the schema Id
            const schemaId = await this.computeSchemaId(schemaRef)
            if (!schemaId) {
                return null
            }

            return {
                schema: schemaRef,
                schemaId
            }
        }

        // Request info from the chain to see if the schema is public
        const schemaId = schemaRef as Hex
        const maybeSchema = await this.viem.readContract<string>(
            contract,
            abi,
            "schemaReverseLookup",
            [schemaId]
        )

        return {
            schema: maybeSchema,
            schemaId
        }
    }

    private async deserialiseRawData(
        rawData: Hex[],
        parentSchemaId: Hex,
        schemaLookup: {
            schema: string;
            schemaId: Hex;
        } | null
    ): Promise<Hex[] | SchemaDecodedItem[][] | null> {
        let parentSchema: string | null = null
        try {
            // Return early if the schema lookup 
            if (!schemaLookup) {
                throw new Error(`Invalid schema lookup`)
            }

            // Resolve the chain id
            const chainId = await this.viem.getChainId()

            // Fetch the required contract info
            const { address, abi } = await getContractAddressAndAbi({
                internal: KnownContracts.STREAMS,
                chainId
            })

            if (parentSchemaId !== zeroBytes32) {
                // TODO - this is only handling depth of 1 we need to handle more
                parentSchema = await this.viem.readContract<string>(
                    address,
                    abi,
                    "schemaReverseLookup",
                    [parentSchemaId]
                )
                console.log("Parent schema is associated with the schema", { parentSchema })
            }

            if (schemaLookup.schema && schemaLookup.schema.length > 0) {
                let finalSchema = schemaLookup.schema
                if (parentSchema) {
                    finalSchema = `${finalSchema}, ${parentSchema}`
                }

                const encoder = new SchemaEncoder(finalSchema)
                const decodedData = rawData.map((raw: Hex) => (encoder.decodeData(raw)))
                return decodedData
            }

            // Return the raw data without decoding direct from chain since we didn't have a public schema
            return rawData
        } catch (e) {
            console.error(e)
        }
        return null
    }
}