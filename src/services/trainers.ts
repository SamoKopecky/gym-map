import type { Trainer } from "@/types/machine"

const benchPressTrainers: Trainer[] = [
  {
    id: 1,
    name: "Mirka",
    fullName: "Miroslava Liptakova",
  },
  {
    id: 2,
    name: "Vendy",
    fullName: "Vendula Susilova",
  },
]

const legPressTrainer: Trainer[] = [
  {
    id: 2,
    name: "Dave",
    fullName: "David Klanica",
  },
]

export function getTrainers(exerciseId: number): Trainer[] {
  if ([1].includes(exerciseId)) {
    return benchPressTrainers
  } else {
    return legPressTrainer
  }
}
