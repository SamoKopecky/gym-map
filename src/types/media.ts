export interface Media {
  id: number
  name: string
  path: string
  content_type: string
  user_id: string
}

export enum MediaType {
  Youtube = "youtube",
  File = "file",
}
