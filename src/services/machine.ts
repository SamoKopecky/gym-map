import { Route, ServiceBase } from "./base"
import type { Machine } from "@/types/machine"

export interface MachinePostRequest {
  name: string
  description?: string
  muscle_groups?: string[]
}

class MachineService extends ServiceBase<object, MachinePostRequest, Machine> {
  constructor() {
    super(Route.Machines)
  }
}

export const machineService = new MachineService()
