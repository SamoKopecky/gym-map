import type { Machine } from "@/types/machine"
import { Difficulty, type Exercise } from "./types/exercise"

export function machineFactory(name?: string, muscleGroups?: string[]): Machine {
  return {
    name: name ?? "foo",
    muscle_groups: muscleGroups ?? [],
    description: "bar",
    height: 1,
    width: 1,
    id: 1,
    position_x: 0,
    position_y: 0,
  }
}

export function exerciseFactory(
  name?: string,
  muscleGroups?: string[],
  diffculty?: Difficulty,
): Exercise {
  return {
    name: name ?? "foo",
    machine_id: 0,
    muscle_groups: muscleGroups ?? [],
    description: "bar",
    difficulty: diffculty,
    id: 1,
  }
}
