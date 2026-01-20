// Dependencies for SDK class
import { Client } from "@/types"
import {
    Streams,
} from "@/modules"

// Exports for SDK consumers
export { zeroBytes32 } from "@/constants"
export { SchemaEncoder } from "@/modules"
export { 
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

export class SDK extends Streams {
    // Public modules that can be accessed on the SDK instance
    streams: Streams

    /**
     * Create a new SDK instance
     * @param client Viem wrapper object for consuming the public client and optionally the wallet client for transactions
     */
    constructor(client: Client) {
        super(client)
        this.streams = new Streams(client)
    }

}