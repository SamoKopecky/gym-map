import type { Card } from "@/types/card"
import type { Exercise } from "@/types/exercise"
import type { Machine } from "@/types/machine"

export function exerciseToCard(exercise: Exercise): Card {
  return {
    name: exercise.name,
    id: exercise.id,
    subtitle: exercise.muscle_groups?.join(", "),
    description: exercise.description,
  }
}

export function machineToCard(machine: Machine): Card {
  return {
    subtitle: machine.muscle_groups?.join(", "),
    name: machine.name,
    id: machine.id,
    description: machine.description,
  }
}

export function getMachineHtmlId(machine: Machine): string {
  return `#${machine.name}-${machine.id}`
}
