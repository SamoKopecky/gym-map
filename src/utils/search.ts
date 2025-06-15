import { type Exercise } from "@/types/exercise"
import type { Machine } from "@/types/machine"
import type { SearchData } from "@/types/other"

export function isMachineSearched(searchData: SearchData, machine: Machine): boolean {
  const adjustedSearchText = searchData.text.toLowerCase()
  return (
    machine.name.toLowerCase().includes(adjustedSearchText) ||
    machine.muscle_groups!.some((mg) => mg.toLowerCase().includes(adjustedSearchText))
  )
}

export function isExerciseSearched(searchData: SearchData, exercise: Exercise): boolean {
  const adjustedSearchText = searchData.text.toLowerCase()
  const textSearched =
    exercise.name.toLowerCase().includes(adjustedSearchText) ||
    exercise.muscle_groups!.some((mg) => mg.toLowerCase().includes(adjustedSearchText))

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
