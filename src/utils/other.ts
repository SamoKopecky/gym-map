// TODO: Test
// Regular expression to capture the video ID from various YouTube URL patterns:
// - youtube.com/watch?v=VIDEO_ID
// - youtu.be/VIDEO_ID
// - youtube.com/embed/VIDEO_ID
// - youtube.com/v/VIDEO_ID
// - youtube.com/shorts/VIDEO_ID
// It handles http/https, www optional, and potential query parameters after the ID.
const youtubeRegex =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/

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

export function isYouTubeUrl(url: string): boolean {
  if (!url || typeof url !== "string") {
    return false
  }

  return youtubeRegex.test(url)
}

export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== "string") {
    return null
  }

  const match = url.match(youtubeRegex)

  if (match && match[1]) {
    return match[1]
  }

  return null
}

export function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}
