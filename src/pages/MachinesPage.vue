<script setup lang="ts">
import type { Machine } from "@/types/machine"
import { isSearched } from "@/utils/search"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { pushToMachinePage } from "@/utils/router"

const machines: Machine[] = [
  {
    description: "This is a squat rack",
    name: "Squat rack",
    dimension: {
      height: 150,
      width: 300,
    },
    muscleGroups: ["chest", "legs", "back"],
    id: 2,
    htmlId: "sr",
    position: {
      y: 0,
      x: 590,
    },
  },
  {
    description: "This is a squat rack",
    name: "Squat rack",
    dimension: {
      height: 150,
      width: 300,
    },
    muscleGroups: ["chest", "legs", "back"],
    id: 1,
    htmlId: "sr",
    position: {
      y: 0,
      x: 590,
    },
  },
  {
    description: "This is a squat rack",
    name: "Squat rack",
    dimension: {
      height: 150,
      width: 300,
    },
    muscleGroups: ["chest", "legs", "back"],
    id: 1,
    htmlId: "sr",
    position: {
      y: 0,
      x: 590,
    },
  },
  {
    description: "This is a squat rack",
    name: "Squat rack",
    dimension: {
      height: 150,
      width: 300,
    },
    muscleGroups: ["chest", "legs", "back"],
    id: 1,
    htmlId: "sr",
    position: {
      y: 0,
      x: 590,
    },
  },
  {
    description: "This is a squat rack",
    name: "Squat rack",
    dimension: {
      height: 150,
      width: 300,
    },
    muscleGroups: ["chest", "legs", "back"],
    id: 1,
    htmlId: "sr",
    position: {
      y: 0,
      x: 590,
    },
  },
  {
    description: "This is a squat rack",
    name: "Squat rack",
    dimension: {
      height: 150,
      width: 300,
    },
    muscleGroups: ["chest", "legs", "back"],
    id: 1,
    htmlId: "sr",
    position: {
      y: 0,
      x: 590,
    },
  },
  {
    description: "This is a leg press",
    htmlId: "lp",
    id: 2,
    name: "Leg press",
    muscleGroups: ["quadriceps", "legs"],
    dimension: {
      height: 130,
      width: 130,
    },
    position: {
      y: 650,
      x: 140,
    },
  },
]

const router = useRouter()

const searchBar = ref<string>()

const searchedMachines = computed(() => {
  if (!searchBar.value) return machines

  return machines.filter((m) => isSearched(searchBar.value!, m))
})
</script>

<template>
  <v-text-field
    v-model="searchBar"
    class="mt-2 mx-2"
    label="Search"
    placeholder="Search anything..."
    variant="outlined"
  ></v-text-field>
  <v-container fluid>
    <v-row>
      <v-col v-for="machine in searchedMachines" :key="machine.id" cols="12" md="4" sm="6" lg="3">
        <v-card
          :title="machine.name"
          :subtitle="machine.muscleGroups.join(', ')"
          @click="pushToMachinePage(router, machine.id)"
        >
          <v-card-text>
            {{ machine.description }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
