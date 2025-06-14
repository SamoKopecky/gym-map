import type { Machine } from "@/types/machine"

export function machineFactory(name?: string, muscleGroups?: string[]): Machine {
  return {
    name: name ?? "foo",
    muscleGroups: muscleGroups ?? [],
    description: "bar",
    dimension: {
      height: 1,
      width: 1,
    },
    htmlId: "foo-id",
    id: 1,
    position: {
      x: 0,
      y: 0,
    },
  }
}
