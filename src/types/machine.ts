export interface Position {
  x: number
  y: number
}

export interface Dimension {
  width: number
  height: number
}

export interface Machine {
  id: string
  name: string
  description: string
  muscleGroups: string[]
  position: Position
  dimension: Dimension
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
