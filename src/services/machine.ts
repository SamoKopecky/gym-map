import { Route, ServiceBase, type PatchBase } from "./base"
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
  width?: number
  height?: number
  position_x?: number
  position_y?: number
}

class MachineService extends ServiceBase<MachinePatchRequest, MachinePostRequest, Machine> {
  constructor() {
    super(Route.Machines)
  }
}

export const machineService = new MachineService()
