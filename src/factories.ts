import type { Machine } from "@/types/machine"
import { Difficulty, type Exercise } from "@/types/exercise"
import type { Instruction } from "@/types/instruction"
import type { DeepReadonly } from "vue"
import { type VueKeycloakInstance, type VueKeycloakTokenParsed } from "@dsb-norge/vue-keycloak-js"

export function machineFactory(name?: string, muscleGroups?: string[]): Machine {
  return {
    name: name ?? "foo",
    muscle_groups: muscleGroups ?? [],
    description: "bar",
    height: 1,
    width: 1,
    id: 1,
    position_x: 0,
    position_y: 0,
    exercise_count: 0,
  }
}

export function exerciseFactory(
  name?: string,
  muscleGroups?: string[],
  diffculty?: Difficulty,
): Exercise {
  return {
    name: name ?? "foo",
    machine_id: 0,
    muscle_groups: muscleGroups ?? [],
    description: "bar",
    difficulty: diffculty,
    id: 1,
    instruction_count: 0,
  }
}

export function instructionFactory(firstName?: string, lastName?: string): Instruction {
  return {
    id: 1,
    description: "",
    user_id: "foo",
    exercise_id: 1,
    email: "bar",
    first_name: firstName ?? "foo",
    last_name: lastName ?? "bar",
    name: "foo bar",
  }
}

export function keycloackTokenFactory(data: {
  roles?: readonly string[]
}): DeepReadonly<VueKeycloakTokenParsed> {
  return {
    realm_access: {
      roles: data.roles!,
    },
  }
}

export function keycloakInstanceFactory(data: {
  roles?: readonly string[]
  subject?: string
}): DeepReadonly<VueKeycloakInstance> {
  return {
    ready: true,
    subject: data.subject ?? "foo",
    authenticated: true,
    tokenParsed: keycloackTokenFactory({ roles: data.roles }),
  }
}
