<script setup lang="ts">
import MapPage from "@/pages/MapPage.vue"
import { ref } from "vue"
import MachinesPage from "@/pages/MachinesPage.vue"

const tab = ref("machines")
</script>

<template>
  <v-app>
    <v-layout>
      <v-app-bar color="yellow">
        <v-spacer></v-spacer>
        <v-tabs v-model="tab" align-tabs="center">
          <v-tab :value="'map'">Map</v-tab>
          <v-tab :value="'machines'">Machines</v-tab>
        </v-tabs>
        <v-spacer></v-spacer>
      </v-app-bar>

      <v-main>
        <v-window v-model="tab">
          <v-window-item value="map">
            <MapPage />
          </v-window-item>
          <v-window-item value="machines">
            <MachinesPage />
          </v-window-item>
        </v-window>
      </v-main>
    </v-layout>
  </v-app>
</template>
