import { Route, ServiceBase } from "./base"
import type { Machine } from "@/types/machine"

class MachineService extends ServiceBase<object, object, Machine> {
  constructor() {
    super(Route.Machines)
  }
}

export const machineService = new MachineService()
