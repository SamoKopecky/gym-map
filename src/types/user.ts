export enum UserRole {
  Viewer,
  Trainer,
  Admin,
}

export interface User {
  id: string
  name?: string
  first_name?: string
  last_name?: string
  email: string
  avatar_id?: string
}
