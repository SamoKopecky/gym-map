export function snap(value: number) {
  const roundToNum = 5
  return Math.round(value / roundToNum) * roundToNum
}
