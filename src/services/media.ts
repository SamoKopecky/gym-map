import { Method, Route, ServiceBase, type PatchBase } from "./base"
import { type Media } from "@/types/media"

class MediaService extends ServiceBase<PatchBase, object, Media> {
  constructor() {
    super(Route.Media)
  }

  public getMetadata(id: number): Promise<Media> {
    return this.handleRequest({
      method: Method.GET,
      route: `${this.route}/:id/metadata`,
      pathParams: { id },
    })
  }
}

export const mediaService = new MediaService()
