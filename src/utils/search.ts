import { type Exercise } from "@/types/exercise"
import type { Instruction } from "@/types/instruction"
import type { Machine } from "@/types/machine"
import type { SearchData } from "@/types/other"

export function isMachineSearched(searchData: SearchData, machine: Machine): boolean {
  const textLower = searchData.text.toLowerCase()
  return (
    machine.name.toLowerCase().includes(textLower) ||
    machine.muscle_groups!.some((mg) => mg.toLowerCase().includes(textLower))
  )
}

export function isExerciseSearched(searchData: SearchData, exercise: Exercise): boolean {
  const adjustedSearchText = searchData.text.toLowerCase()
  const textSearched = exercise.name.toLowerCase().includes(adjustedSearchText)

  let difficultySearched = true
  if (searchData.difficulties.length !== 0) {
    if (exercise.difficulty) {
      difficultySearched = searchData.difficulties.includes(exercise.difficulty)
    } else {
      return false
    }
  }

  return textSearched && difficultySearched
}

export function isInstructionSearched(searchData: SearchData, instruction: Instruction): boolean {
  const textLower = searchData.text.toLowerCase()

  if (!instruction.first_name || !instruction.last_name) return true

  return (
    instruction.first_name.toLowerCase().includes(textLower) ||
    instruction.last_name.toLowerCase().includes(textLower)
  )
}
