export interface Card {
  id: number
  name: string
  subtitle?: string
  description?: string
  chips?: Chip[]
}

export interface Chip {
  text: string
  color: string
}

export type CardPanelName = "Machines" | "Exercises" | "Instructions"
