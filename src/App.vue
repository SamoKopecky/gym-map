<script setup lang="ts">
import MapView from "@/components/MapView.vue"
import { ref } from "vue"

const tab = ref(null)
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
            <MapView></MapView>
          </v-window-item>
          <v-window-item value="machines">
            <div>Machines Content Here</div>
          </v-window-item>
        </v-window>
      </v-main>
    </v-layout>
  </v-app>
</template>
