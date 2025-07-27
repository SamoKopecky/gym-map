import type { CategoryProperties } from "@/types/category"

export function categoriesToPropertyIds(categories: CategoryProperties[]): number[] {
  const property_ids = new Set<number>()
  categories.forEach((c) => c.properties.forEach((p) => property_ids.add(p.id)))
  return Array.from(property_ids)
}
