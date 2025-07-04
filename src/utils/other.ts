export function randomStringId(): string {
  return (Math.random() + 1).toString(36).substring(2)
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

export function randomNumberId(): number {
  // Get 8 bytes (64 bits) of random data
  const buffer = new Uint8Array(8)
  crypto.getRandomValues(buffer)

  // Convert bytes to a BigInt (assuming little-endian, common case)
  // Use DataView for cross-platform endianness handling
  const dataView = new DataView(buffer.buffer)
  let randomBigInt = dataView.getBigUint64(0, true) // true for little-endian

  // Mask it to get a positive 63-bit number (0 to 2^63 - 1)
  // This ensures it fits within the positive range of a signed 64-bit integer
  // (The highest bit of a signed int is the sign bit)
  const positiveMask = (1n << 63n) - 1n // BigInt literal requires 'n'
  randomBigInt = randomBigInt & positiveMask

  return Number(randomBigInt)
}
