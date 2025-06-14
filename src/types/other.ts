export type NotificationType = "success" | "info" | "warning" | "error" | undefined

export interface ChangeNotification {
  type: NotificationType
  text: string
}
