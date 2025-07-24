import { type Entity } from "./base"

export enum Difficulty {
  Easy = "easy",
  Normal = "normal",
  Hard = "hard",
}

export interface Exercise extends Entity {
  machine_id: number
  name: string
  description?: string
  muscle_groups?: string[]
  difficulty?: Difficulty
  property_ids: number[]
  instruction_count: number
}

// Used for post data in machine detail
export interface ExerciseState {
  name: string
  description: string
  muscle_groups: string[]
  property_ids: number[]
  difficulty?: Difficulty
}
