import { Method, Route, ServiceBase, type PatchBase } from "./base"
import type { Machine } from "@/types/machine"

export interface MachinePostRequest {
  name: string
  description?: string
  muscle_groups?: string[]
}

export interface MachinePatchRequest extends PatchBase {
  name?: string
  description?: string
  muscle_groups?: string[]
}

export interface MachinePositionPatchRequest extends PatchBase {
  width: number
  height: number
  position_x: number
  position_y: number
}

class MachineService extends ServiceBase<MachinePatchRequest, MachinePostRequest, Machine> {
  constructor() {
    super(Route.Machines)
  }

  public async patchPosition(jsonParams: MachinePositionPatchRequest): Promise<void> {
    return this.handleRequest({
      jsonParams,
      pathParams: { id: jsonParams.id },
      method: Method.PATCH,
      route: `${this.route}/:id/positions`,
    })
  }
}

export const machineService = new MachineService()
