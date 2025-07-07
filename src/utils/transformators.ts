import type { Card, Chip } from "@/types/card"
import { Difficulty, type Exercise } from "@/types/exercise"
import type { Instruction } from "@/types/instruction"
import type { Machine } from "@/types/machine"

export function exerciseToCard(exercise: Exercise): Card {
  const chips: Chip[] = []
  if (exercise.difficulty) {
    chips.push({
      text: difficultyToString(exercise.difficulty),
      color: difficultyToColor(exercise.difficulty),
    })
  }

  return {
    name: exercise.name,
    id: exercise.id,
    subtitle: exercise.muscle_groups?.join(", "),
    description: exercise.description,
    chips: chips,
    count: exercise.instruction_count,
  }
}

export function machineToCard(machine: Machine): Card {
  return {
    subtitle: machine.muscle_groups?.join(", "),
    name: machine.name,
    id: machine.id,
    description: machine.description,
    count: machine.exercise_count ?? 0,
  }
}

export function instructionToCard(instruction: Instruction): Card {
  return {
    subtitle: "",
    name: instruction.name ?? "N/A",
    id: instruction.id,
    description: "",
    imageId: instruction.avatar_id,
  }
}

export function getMachineHtmlId(machine: Machine): string {
  return `${machine.name.toLowerCase().replace(/ /g, "-")}-${machine.id}`
}

export function difficultyToString(difficulty: Difficulty): string {
  switch (difficulty) {
    case Difficulty.Easy:
      return "Easy"
    case Difficulty.Normal:
      return "Normal"
    case Difficulty.Hard:
      return "Hard"
  }
}

export function difficultyToColor(difficulty: Difficulty): string {
  switch (difficulty) {
    case Difficulty.Easy:
      return "green"
    case Difficulty.Normal:
      return "orange"
    case Difficulty.Hard:
      return "red"
  }
}
