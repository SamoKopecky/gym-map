import { Route, ServiceBase, type PatchBase } from "./base"
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

class ExerciseService extends ServiceBase<ExercisePatchRequest, ExercisePostRequest, Exercise> {
  constructor() {
    super(Route.Exercises)
  }
}

export const exerciseService = new ExerciseService()
