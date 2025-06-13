import { type Entity } from "./base"

export interface Exercise extends Entity {
  machineId: number
  name: string
  description?: string
  muscle_groups?: string[]
}

// Used for post data in machine detail
export interface ExerciseState {
  name: string
  description: string
  muscle_groups: string[]
}
