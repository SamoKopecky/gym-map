import type { Entity } from "./base"

export interface Property extends Entity {
  name: string
  category_id: number
}
