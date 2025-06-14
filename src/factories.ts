import type { Machine } from "@/types/machine"

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
