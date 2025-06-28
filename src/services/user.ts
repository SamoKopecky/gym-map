import type { User } from "@/types/user"
import { Method, Route, ServiceBase, type PatchBase } from "./base"

export interface userPostRequest {
  email: string
}

export interface UserGetRequest {
  id: string
}

class UserService extends ServiceBase<PatchBase, userPostRequest, User> {
  constructor() {
    super(Route.Users)
  }

  public async get(request?: UserGetRequest): Promise<User[]> {
    return this.handleRequest({
      method: Method.GET,
      route: this.route,
      queryParams: request,
    })
  }

  public async deleteUser(id: string): Promise<void> {
    return this.handleRequest({
      pathParams: { id },
      method: Method.DELETE,
      route: `${this.route}/:id`,
    })
  }
}

export const userService = new UserService()
