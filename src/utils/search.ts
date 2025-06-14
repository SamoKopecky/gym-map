import type { Exercise } from "@/types/exercise"
import type { Machine } from "@/types/machine"

export function isMachineSearched(searchText: string, machine: Machine): boolean {
  const adjustedSearchText = searchText.toLowerCase()
  return (
    machine.name.toLowerCase().includes(adjustedSearchText) ||
    machine.muscle_groups!.some((mg) => mg.toLowerCase().includes(adjustedSearchText))
  )
}

export function isExerciseSearched(searchText: string, exercise: Exercise): boolean {
  const adjustedSearchText = searchText.toLowerCase()
  return (
    exercise.name.toLowerCase().includes(adjustedSearchText) ||
    exercise.muscle_groups!.some((mg) => mg.toLowerCase().includes(adjustedSearchText))
  )
}
