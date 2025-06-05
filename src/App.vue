<script setup lang="ts">
import { ref } from "vue"

const tab = ref("machines")
</script>

<template>
  <v-app>
    <v-layout>
      <v-app-bar color="yellow">
        <v-spacer></v-spacer>
        <v-tabs v-model="tab" align-tabs="center">
          <v-tab to="/map" :value="'map'">Map</v-tab>
          <v-tab to="/machines" :value="'machines'">Machines</v-tab>
        </v-tabs>
        <v-spacer></v-spacer>
      </v-app-bar>

      <v-main>
        <RouterView />
      </v-main>
    </v-layout>
  </v-app>
</template>
