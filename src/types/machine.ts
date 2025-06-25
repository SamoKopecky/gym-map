import { type Entity } from "./base.ts"

export interface Machine extends Entity, Position {
  name: string
  description?: string
  muscle_groups?: string[]
  exercise_count: number
}

export interface MapMachine extends Machine {
  is_origin: boolean
}

// Used for post data in machine detail
export interface MachineState {
  name: string
  description: string
  muscle_groups: string[]
}

export interface Position {
  position_x: number
  position_y: number
  width: number
  height: number
}
