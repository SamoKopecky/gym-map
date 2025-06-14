import { type Router } from "vue-router"

export function pushToMachinesPage(router: Router, machineId: number) {
  router.push({ path: `/machines/${machineId}` })
}
