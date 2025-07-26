import { Route, ServiceBase, type PatchBase } from "./base"
import type { Property } from "@/types/property"

export interface PropertyPostRequest {
  name: string
  category_id: number
}

export interface PropertyPatchRequest extends PatchBase {
  name: string
}

class PropertyService extends ServiceBase<PropertyPatchRequest, PropertyPostRequest, Property> {
  constructor() {
    super(Route.Properties)
  }
}

export const propertyService = new PropertyService()
