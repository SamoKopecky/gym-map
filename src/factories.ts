import type { Machine } from "@/types/machine"
import { Difficulty, type Exercise } from "@/types/exercise"
import type { Instruction } from "@/types/instruction"
import type { Property } from "./types/property"

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
    exercise_count: 0,
  }
}

export function exerciseFactory(data: {
  name?: string
  propertyNames?: string[]
  diffculty?: Difficulty
  propertyIds?: number[]
}): Exercise {
  const properties = data.propertyNames?.map((n, index) => {
    const prop: Property = {
      id: index + 1,
      name: n,
      category_id: 1,
    }

    return prop
  })
  return {
    categories: [
      {
        id: 1,
        name: "xyz",
        properties: properties ?? [],
      },
    ],
    name: data.name ?? "foo",
    machine_id: 0,
    description: "bar",
    difficulty: data.diffculty,
    id: 1,
    instruction_count: 0,
    property_ids: data.propertyIds ?? [],
  }
}

export function instructionFactory(firstName?: string, lastName?: string): Instruction {
  return {
    id: 1,
    description: "",
    user_id: "foo",
    exercise_id: 1,
    email: "bar",
    first_name: firstName ?? "foo",
    last_name: lastName ?? "bar",
    name: "foo bar",
    media_ids: [],
  }
}
