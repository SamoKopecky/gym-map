export interface Instruction {
  id: number
  exercise_id: number
  user_id: string
  description: string
  file_id?: string
  file_name?: string

  name?: string
  first_name?: string
  last_name?: string
  email: string
}

export interface InstructionState {
  description: string
}
