import type { Exercise } from "@/types/machine"

const squatRack: Exercise[] = [
  {
    id: 1,
    availableVideos: 2,
    muscleGroups: ["feet", "legs"],
    name: "squat",
  },
  {
    id: 2,
    availableVideos: 1,
    muscleGroups: ["chest"],
    name: "bench press",
  },
  {
    id: 3,
    availableVideos: 1,
    muscleGroups: ["back", "lats"],
    name: "pull ups",
  },
]

const legPress: Exercise[] = [
  {
    id: 1,
    availableVideos: 2,
    muscleGroups: ["feet", "legs"],
    name: "wide stance",
  },
  {
    id: 2,
    availableVideos: 1,
    muscleGroups: ["feet", "legs"],
    name: "narrow stance",
  },
]

export function getExercises(machineId: number): Exercise[] {
  if (machineId === 1) {
    return squatRack
  } else {
    return legPress
  }
}
