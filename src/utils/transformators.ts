import type { ChoiseItem, Exercise, Trainer } from "@/types/machine"

export function trainerToItem(trainer: Trainer): ChoiseItem {
  return {
    name: trainer.name,
    id: trainer.id,
    subtitle: trainer.fullName,
  }
}

export function exerciseToItem(exercise: Exercise): ChoiseItem {
  return {
    name: exercise.name,
    id: exercise.id,
    subtitle: exercise.muscleGroups.join(", "),
    append: `${exercise.availableVideos}`,
  }
}
