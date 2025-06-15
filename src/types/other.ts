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
