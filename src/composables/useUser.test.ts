import { describe, it, expect, vi } from "vitest"
import { useUser } from "@/composables/useUser"
import * as kc from "@dsb-norge/vue-keycloak-js"
import { UserRole } from "@/types/user"
import { keycloakInstanceFactory } from "@/factories"

describe("useUser", () => {
  it.each([
    {
      roles: ["admin"],
      expectedIsAdmin: true,
      expectedIsTrainer: true,
      expectedUserRole: UserRole.Admin,
    },
    {
      roles: ["admin", "trainer"],
      expectedIsAdmin: true,
      expectedIsTrainer: true,
      expectedUserRole: UserRole.Admin,
    },
    {
      roles: ["trainer"],
      expectedIsAdmin: false,
      expectedIsTrainer: true,
      expectedUserRole: UserRole.Trainer,
    },
    {
      roles: [],
      expectedIsAdmin: false,
      expectedIsTrainer: false,
      expectedUserRole: UserRole.Viewer,
    },
  ])(
    "correctly returns all variables for $roles",
    ({ expectedUserRole, expectedIsTrainer, expectedIsAdmin, roles }) => {
      // Mock keycloack
      vi.spyOn(kc, "useKeycloak").mockImplementation(() => keycloakInstanceFactory({ roles }))

      const { userId, isAdmin, userRole, isTrainer } = useUser()

      expect(userId).toBe("foo")
      expect(userRole.value).toBe(expectedUserRole)
      expect(isAdmin.value).toBe(expectedIsAdmin)
      expect(isTrainer.value).toBe(expectedIsTrainer)
    },
  )
})
