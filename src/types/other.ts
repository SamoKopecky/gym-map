import type { Difficulty } from "./exercise"

export type NotificationType = "success" | "info" | "warning" | "error" | undefined

export interface ChangeNotification {
  type: NotificationType
  text: string
}

export interface SearchData {
  text: string
  difficulties: Difficulty[]
}

export interface MediaInfo {
  url: string
  type: string
  name: string
}

export interface FileInfo {
  data?: File
  name?: string
  uploadProgress?: number
}
