<script setup lang="ts">
import NotificationPopup from "@/components/NotificationPopup.vue"
import { useKeycloak } from "@dsb-norge/vue-keycloak-js"
import { onMounted } from "vue"
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useUser } from "./composables/useUser"
import { useI18n } from "vue-i18n"

const keycloak = useKeycloak()
const { isAdmin } = useUser()
const route = useRoute()
const router = useRouter()
const tab = ref<string>()
const { t, locale } = useI18n()

const availableLocales = [
  { code: "cs", name: "Čeština", flag: "🇨🇿" },
  { code: "en", name: "English", flag: "🇺🇸" },
]

function switchLocale(localeCode: string) {
  locale.value = localeCode
}

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
            <v-tab to="/map" value="map">{{ t("navigation.map") }}</v-tab>
            <v-tab to="/machines" value="machines">{{ t("navigation.machines") }}</v-tab>
            <v-tab to="/admin" value="admin" v-if="isAdmin">{{ t("navigation.admin") }}</v-tab>
          </v-tabs>
        </div>

        <template #append>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-translate" variant="text" v-bind="props"></v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="loc in availableLocales"
                :key="loc.code"
                @click="switchLocale(loc.code)"
              >
                <template #prepend>
                  <span class="me-3">{{ loc.flag }}</span>
                </template>
                <v-list-item-title>{{ loc.name }}</v-list-item-title>
                <template #append v-if="locale === loc.code">
                  <v-icon>mdi-check</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
            </template>

            <v-list>
              <v-list-item
                v-if="keycloak.subject"
                :title="keycloak.fullName"
                prepend-icon="mdi-account"
                @click="router.push('/user')"
              />
              <v-list-item
                @click="keycloak.subject ? logout() : login()"
                :title="keycloak.subject ? t('message.logout') : t('message.login')"
              />
            </v-list>
          </v-menu>
        </template>
      </v-app-bar>

      <v-main>
        <RouterView />
      </v-main>
    </v-layout>
  </v-app>
</template>
