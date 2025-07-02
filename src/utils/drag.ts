export function roundTo(value: number) {
  const roundToNum = 5
  return Math.round(value / roundToNum) * roundToNum
}
