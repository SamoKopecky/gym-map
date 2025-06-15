import { type VueKeycloakTokenParsed } from "@dsb-norge/vue-keycloak-js"
import { type DeepReadonly } from "vue"
import { UserRole } from "../types/user"

export function hasRole(
  token: DeepReadonly<VueKeycloakTokenParsed> | undefined,
  regex: RegExp,
): boolean {
  if (token && token.realm_access) {
    return token.realm_access.roles.some((item) => regex.test(item))
  }
  return false
}

export function getUserRole(token: DeepReadonly<VueKeycloakTokenParsed> | undefined): UserRole {
  const trainerRegex = /trainer/
  const adminRegex = /admin/
  if (hasRole(token, adminRegex)) {
    return UserRole.Admin
  } else if (hasRole(token, trainerRegex)) {
    return UserRole.Trainer
  } else {
    return UserRole.Viewer
  }
}
