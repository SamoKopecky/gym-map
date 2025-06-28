import type { User } from "./user"

export interface Instruction extends Omit<User, "id"> {
  id: number
  exercise_id: number
  user_id: string
  description: string
  media_id?: number
}

export interface InstructionState {
  description: string
}
