import { createRouter, createWebHistory } from "vue-router"
import MapPage from "@/pages/MapPage.vue"
import MachinesPage from "@/pages/MachinesPage.vue"
import AdminPage from "@/pages/AdminPage.vue"
import UserPage from "@/pages/UserPage.vue"

const routes = [
  { path: "/", component: MachinesPage, name: "default" },
  { path: "/admin", component: AdminPage, name: "Admin" },
  { path: "/user", component: UserPage, name: "User" },
  { path: "/map/:id?", component: MapPage, name: "Map", props: true },
  { path: "/machines/:id?", component: MachinesPage, name: "Machines", props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
