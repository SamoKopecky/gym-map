import { Method, Route, ServiceBase, type PatchBase } from "./base"
import { type Instruction } from "@/types/instruction"

export interface InterfacePostRequest {
  description: string
  user_id: string
  exercise_id: number
}

export interface InterfacePatchRequest extends PatchBase {
  description?: string
}

export interface InstructionQueryParams {
  exercise_id?: number
  user_id?: string
}

export interface InstructionMediaPostResponse {
  media_id: number
}

class InstructionService extends ServiceBase<
  InterfacePatchRequest,
  InterfacePostRequest,
  Instruction
> {
  constructor() {
    super(Route.Instructions)
  }

  public async get(queryParams?: InstructionQueryParams): Promise<Instruction[]> {
    return this.handleRequest({
      queryParams,
      method: Method.GET,
      route: this.route,
    })
  }

  public postFile(id: number, data: FormData): Promise<InstructionMediaPostResponse> {
    return this.handleRequest({
      method: Method.POST,
      route: `${this.route}/:id/media`,
      pathParams: { id },
      postBody: data,
    })
  }
}

export const instructionService = new InstructionService()
