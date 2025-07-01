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
}

export const mapFileService = new MapFileService()
