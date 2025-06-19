<script setup lang="ts">
import NotificationPopup from "@/components/NotificationPopup.vue"
import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import { onMounted } from "vue"
import { ref, watch } from "vue"
import { useRoute } from "vue-router"
import { useUser } from "./composables/useUser"

const keycloak = useKeycloak()
const { isAdmin } = useUser()
const route = useRoute()
const tab = ref<string>()

const getTabFromPath = (path: string) => {
  if (path.startsWith("/machines")) {
    return "machines"
  }
  if (path.startsWith("/map")) {
    return "map"
  }
  if (path.startsWith("/admin")) {
    return "admin"
  }

  return ""
}

onMounted(() => (tab.value = getTabFromPath(route.path)))

watch(
  () => route.path,
  (newPath) => {
    tab.value = getTabFromPath(newPath)
  },
)

function logout() {
  if (keycloak && keycloak.logoutFn) {
    keycloak.logoutFn()
  }
}
function login() {
  if (keycloak && keycloak.loginFn) {
    keycloak.loginFn()
  }
}
</script>

<template>
  <v-app>
    <NotificationPopup />
    <v-layout>
      <v-app-bar color="yellow">
        <div
          class="d-flex justify-center align-center"
          style="position: absolute; width: 100%; height: 100%"
        >
          <v-tabs v-model="tab">
            <v-tab to="/map" value="map">Map</v-tab>
            <v-tab to="/machines" value="machines">Machines</v-tab>
            <v-tab to="/admin" value="admin" v-if="isAdmin">Admin</v-tab>
          </v-tabs>
        </div>

        <template #append>
          <div v-if="keycloak.subject">
            <span class="font-weight-medium mr-2">{{ keycloak.fullName }}</span>
            <v-icon>mdi-account</v-icon>

            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
              </template>

              <v-list>
                <v-list-item @click="logout" title="Logout" />
              </v-list>
            </v-menu>
          </div>
          <div v-else>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
              </template>

              <v-list>
                <v-list-item @click="login" title="Login" />
              </v-list>
            </v-menu>
          </div>
        </template>
      </v-app-bar>

      <v-main>
        <RouterView />
      </v-main>
    </v-layout>
  </v-app>
</template>
