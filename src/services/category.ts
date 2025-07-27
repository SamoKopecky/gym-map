import { Method, Route, ServiceBase, type PatchBase } from "./base"
import type { Category, CategoryProperties } from "@/types/category"

export interface CategoryPostRequest {
  name: string
}

export interface CategoryPatchRequest extends PatchBase {
  name: string
}

class CategoryService extends ServiceBase<CategoryPatchRequest, CategoryPostRequest, Category> {
  constructor() {
    super(Route.Categories)
  }

  public async get(): Promise<CategoryProperties[]> {
    return this.handleRequest({
      method: Method.GET,
      route: this.route,
    })
  }
}

export const categoryService = new CategoryService()
