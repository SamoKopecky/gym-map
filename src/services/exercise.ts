import { Method, Route, ServiceBase, type PatchBase } from "./base"
import type { Exercise } from "@/types/exercise"

export interface ExercisePostRequest {
  machine_id: number
  name: string
  description?: string
  muscle_groups?: string[]
}

export interface ExercisePatchRequest extends PatchBase {
  name?: string
  description?: string
  muscle_groups?: string[]
}

export interface ExerciseQueryParams {
  machine_id: number
}

class ExerciseService extends ServiceBase<ExercisePatchRequest, ExercisePostRequest, Exercise> {
  constructor() {
    super(Route.Exercises)
  }

  public async get(queryParams?: ExerciseQueryParams): Promise<Exercise[]> {
    return this.handleRequest({
      queryParams,
      method: Method.GET,
      route: this.route,
    })
  }
}

export const exerciseService = new ExerciseService()
