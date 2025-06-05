import { createRouter, createWebHistory } from "vue-router"
import MapPage from "@/pages/MapPage.vue"

const routes = [{ path: "/", component: MapPage, name: "Home" }]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
