export function randomStringId(): string {
  return (Math.random() + 1).toString(36).substring(2)
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}
