import { createRouter, createWebHistory } from "vue-router"
import MapPage from "@/pages/MapPage.vue"
import MachinesPage from "@/pages/MachinesPage.vue"
import MachinePage from "@/pages/MachinePage.vue"

const routes = [
  { path: "/", component: MachinesPage, name: "MachinesDefault" },
  { path: "/map", component: MapPage, name: "Map" },
  { path: "/machine/:id", component: MachinePage, name: "Machine", props: true },
  { path: "/machines", component: MachinesPage, name: "Machines" },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
