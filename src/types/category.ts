import type { Entity } from "./base"
import type { Property } from "../types/property"

export interface Category extends Entity {
  name: string
}

export interface CategoryProperties extends Category {
  properties: Property[]
}
