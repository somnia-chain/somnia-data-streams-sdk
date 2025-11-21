import { toBytes } from "viem"
import { GzipOptions } from 'fflate'

export const zeroBytes32 = `0x${Buffer.from(toBytes(0, { size: 32 })).toString("hex")}`

export const compressionConfig: GzipOptions = { level: 9 }