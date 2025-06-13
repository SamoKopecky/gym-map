export interface Position {
  x: number
  y: number
}

export interface Dimension {
  width: number
  height: number
}

export interface Machine extends Entity {
  htmlId?: string
  name: string
  description?: string
  muscle_groups?: string[]
  position: Position
  dimension: Dimension
}

export interface MachineState {
  name: string
  description: string
  muscle_groups: string[]
}

export interface Exercise {
  id: number
  name: string
  muscleGroups: string[]
  availableVideos: number
}

export interface Trainer {
  id: number
  name: string
  fullName: string
}

export interface ChoiseItem {
  id: number
  name: string
  subtitle: string
  append?: string
}

export interface Card {
  id: number
  name: string
  subtitle?: string
  description?: string
}

export type CardPanelName = "Machines" | "Exercises"

export interface Entity {
  id: number
}
