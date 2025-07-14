import { describe, expect, it } from "vitest"

import { keycloackTokenFactory } from "@/factories"
import { getUserRole, hasRole } from "./user"
import { UserRole } from "@/types/user"

describe("hasRole", () => {
  it.each([
    { regex: /trainer/, roles: ["admin", "trainer"], result: true },
    { regex: /trainer/, roles: ["trainer"], result: true },
    { regex: /admin/, roles: ["admin", "trainer"], result: true },
    { regex: /foo/, roles: ["admin", "trainer"], result: false },
    { regex: /admin/, roles: [], result: false },
  ])("matches with regex $regex with roles $roles to be $result", ({ regex, roles, result }) => {
    const token = keycloackTokenFactory({ roles: roles })

    const res = hasRole(token, regex)

    expect(res).toBe(result)
  })
})

describe("getUserRole", () => {
  it.each([
    { tokenRoles: ["trainer"], role: UserRole.Trainer },
    { tokenRoles: ["admin", "trainer"], role: UserRole.Admin },
    { tokenRoles: ["admin"], role: UserRole.Admin },
    { tokenRoles: [""], role: UserRole.Viewer },
    { tokenRoles: ["foo", "bar"], role: UserRole.Viewer },
  ])("correctly returns $role with $tokenRoles ", ({ tokenRoles, role }) => {
    const token = keycloackTokenFactory({ roles: tokenRoles })

    const res = getUserRole(token)

    expect(res).toBe(role)
  })
})
