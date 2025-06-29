export function roundTo(value: number, roundTo: number) {
  return Math.round(value / roundTo) * roundTo
}
