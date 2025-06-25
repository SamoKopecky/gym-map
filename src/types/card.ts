export interface Card {
  id: number
  name: string
  subtitle?: string
  description?: string
  chips?: Chip[]
  count?: number
}

export interface Chip {
  text: string
  color: string
}

export type CardPanelName = "Machines" | "Exercises" | "Instructions"
