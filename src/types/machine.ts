import { type Entity } from "./base.ts"

export interface Machine extends Entity {
  name: string
  description?: string
  muscle_groups?: string[]
  position_x: number
  position_y: number
  width: number
  height: number
}

// Used for post data in machine detail
export interface MachineState {
  name: string
  description: string
  muscle_groups: string[]
}
