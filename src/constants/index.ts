import { toBytes } from "viem"

export const zeroBytes32 = `0x${Buffer.from(toBytes(0, { size: 32 })).toString("hex")}`