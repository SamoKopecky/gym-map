import { type Router } from "vue-router"

export function pushToMachinePage(router: Router, machineId: number) {
  router.push({ path: `/machine/${machineId}` })
}
