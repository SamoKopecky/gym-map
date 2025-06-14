<script setup lang="ts">
import NotificationPopup from "@/components/NotificationPopup.vue"
import { onMounted } from "vue"
import { ref, watch } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const tab = ref<string>()

const getTabFromPath = (path: string) => {
  if (path.startsWith("/machines")) {
    return "machines"
  }
  if (path.startsWith("/map")) {
    return "map"
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
</script>

<template>
  <v-app>
    <NotificationPopup />
    <v-layout>
      <v-app-bar color="yellow">
        <v-spacer></v-spacer>
        <v-tabs v-model="tab" align-tabs="center">
          <v-tab to="/map" value="map">Map</v-tab>
          <v-tab to="/machines" value="machines">Machines</v-tab>
        </v-tabs>
        <v-spacer></v-spacer>
      </v-app-bar>

      <v-main>
        <RouterView />
      </v-main>
    </v-layout>
  </v-app>
</template>
