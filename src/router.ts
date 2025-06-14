import { createRouter, createWebHistory } from "vue-router"
import MapPage from "@/pages/MapPage.vue"
import MachinesPage from "@/pages/MachinesPage.vue"

const routes = [
  { path: "/", component: MachinesPage, name: "MachinesDefault" },
  { path: "/map/:id?", component: MapPage, name: "Map", props: true },
  { path: "/machines/:id?", component: MachinesPage, name: "Machines", props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
