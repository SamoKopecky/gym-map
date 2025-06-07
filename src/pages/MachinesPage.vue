<script setup lang="ts">
import { type Machine } from "@/types/machine"
import { ref } from "vue"
import CardPanel from "@/components/CardPanel.vue"

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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
    htmlId: "sr",
    position: {
      y: 0,
      x: 590,
    },
  },
  {
    description: "This is a leg press",
    htmlId: "lp",
    id: 7,
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

const searchBar = ref<string>()
const panelsShow = ref<string[]>([])

function handleCardSelect(panelName: string) {
  // Remove machines from selected expansion panels to hide it
  panelsShow.value = panelsShow.value?.filter((p) => p !== panelName)
}
</script>

<template>
  <v-text-field
    v-model="searchBar"
    class="mt-2 mx-2"
    label="Search"
    placeholder="Search anything..."
    variant="outlined"
  ></v-text-field>
  <v-expansion-panels v-model="panelsShow" multiple>
    <CardPanel
      v-model:cards="machines"
      name="Machines"
      :search-bar="searchBar"
      @select:card="handleCardSelect"
    />
    <CardPanel
      v-model:cards="machines"
      name="Exercises"
      :search-bar="searchBar"
      @select:card="handleCardSelect"
    />
  </v-expansion-panels>
</template>
