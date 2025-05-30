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
  position: Position
  dimension: Dimension
}
