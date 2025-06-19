import type { User } from "@/types/user"
import { Route, ServiceBase, type PatchBase } from "./base"

class UserService extends ServiceBase<PatchBase, object, User> {
  constructor() {
    super(Route.Users)
  }
}

export const userService = new UserService()
