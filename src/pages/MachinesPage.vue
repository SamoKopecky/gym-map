<script setup lang="ts">
import type { Machine } from "@/types/machine"
import { computed, ref, watch } from "vue"
import CardList from "@/components/CardList.vue"

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
const selectedMachine = ref<Machine | undefined>()

const machinesTitle = computed(() => {
  if (!selectedMachine.value) {
    return "Machines"
  } else {
    return selectedMachine.value.name
  }
})

watch(selectedMachine, (newVal: Machine | undefined) => {
  if (newVal) {
    // Remove machines from selected expansion panels to hide it
    panelsShow.value = panelsShow.value?.filter((p) => p !== "machines")
  }
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
  <v-expansion-panels v-model="panelsShow" multiple>
    <v-expansion-panel :title="machinesTitle" value="machines">
      <template #text>
        <CardList
          v-model:cards="machines"
          v-model:selected="selectedMachine"
          :search-bar="searchBar"
        />
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
