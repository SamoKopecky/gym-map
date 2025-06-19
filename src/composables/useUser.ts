import { UserRole } from "@/types/user"
import { getUserRole } from "@/utils/user"
import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import { computed } from "vue"

export function useUser() {
  const keycloak = useKeycloak()
  const userRole = computed(() => getUserRole(keycloak.tokenParsed))
  const isAdmin = computed(() => userRole.value === UserRole.Admin)
  const isTrainer = computed(() => isAdmin.value || userRole.value === UserRole.Trainer)
  const userId = keycloak.subject

  return { userRole, isAdmin, isTrainer, userId }
}
