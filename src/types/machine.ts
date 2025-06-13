import { type Entity } from "./base.ts"

export interface Position {
  x: number
  y: number
}

export interface Dimension {
  width: number
  height: number
}

export interface Machine extends Entity {
  htmlId?: string
  name: string
  description?: string
  muscle_groups?: string[]
  position: Position
  dimension: Dimension
}

// Used for post data in machine detail
export interface MachineState {
  name: string
  description: string
  muscle_groups: string[]
}
