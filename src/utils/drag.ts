import { GRID_SIZE } from "@/constants"

export function snap(value: number) {
  const roundToNum = GRID_SIZE
  return Math.round(value / roundToNum) * roundToNum
}
