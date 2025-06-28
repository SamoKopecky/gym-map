import type { User } from "@/types/user"
import { Method, Route, ServiceBase, type PatchBase } from "./base"

export interface userPostRequest {
  email: string
}

export interface UserPatchResponse {
  avatar_id: string
}

class UserService extends ServiceBase<PatchBase, userPostRequest, User> {
  constructor() {
    super(Route.Users)
  }

  public async getUser(id: string): Promise<User> {
    return this.handleRequest({
      method: Method.GET,
      route: `${this.route}/:id`,
      pathParams: { id },
    })
  }

  public async deleteUser(id: string): Promise<void> {
    return this.handleRequest({
      pathParams: { id },
      method: Method.DELETE,
      route: `${this.route}/:id`,
    })
  }

  public postFile(data: FormData): Promise<UserPatchResponse> {
    return this.handleRequest({
      method: Method.PATCH,
      route: `${this.route}/profile`,
      postBody: data,
    })
  }
}

export const userService = new UserService()
