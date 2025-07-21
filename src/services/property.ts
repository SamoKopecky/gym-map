import { Route, ServiceBase, type PatchBase } from "./base"
import type { Property } from "@/types/property"

export interface PropertyPostRequest {
  name: string
  category_id: number
}

class PropertyService extends ServiceBase<PatchBase, PropertyPostRequest, Property> {
  constructor() {
    super(Route.Properties)
  }
}

export const propertyService = new PropertyService()
