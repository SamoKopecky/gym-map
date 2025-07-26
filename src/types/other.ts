import type { Difficulty } from "./exercise"
import type { Property } from "./property"

export type NotificationType = "success" | "info" | "warning" | "error" | undefined

export interface ChangeNotification {
  type: NotificationType
  text: string
}

export interface SearchData {
  text: string
  difficulties: Difficulty[]
  properties: Property[]
}

export interface MediaInfo {
  url: string
  type: string
  name: string
  id: number
}

export interface FileInfo {
  data?: File
  uploadProgress?: number
}
