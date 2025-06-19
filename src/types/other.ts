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

export interface MediaBlob {
  url?: string
  type?: string
  loading: boolean
}

export interface FileInfo {
  data?: File
  name?: string
  loading: boolean
}
