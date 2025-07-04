import { Method, Route, ServiceBase, type PatchBase } from "./base"
import { type MapFile } from "../types/mapFile"

class MapFileService extends ServiceBase<PatchBase, object, object> {
  constructor() {
    super(Route.Map)
  }

  public getMap(): Promise<MapFile> {
    return this.handleRequest({
      method: Method.GET,
      route: this.route,
    })
  }

  public postFile(data: FormData): Promise<void> {
    return this.handleRequest({
      method: Method.PUT,
      route: this.route,
      postBody: data,
    })
  }
}

export const mapFileService = new MapFileService()
