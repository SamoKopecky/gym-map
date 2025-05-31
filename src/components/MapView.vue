<script setup lang="ts">
import MachineInfo from "@/components/MachineInfo.vue"
import type { Machine } from "@/types/machine"
import { ref } from "vue"

const showMenu = ref(false)
const isOpen = ref(false)
const activeMachine = ref<Machine>()
const machines: Machine[] = [
  {
    description: "This is a bench press",
    name: "Bench press",
    dimension: {
      height: 180,
      width: 190,
    },
    muscleGroups: ["chest", "tricep", "shoulder"],
    id: "bp",
    position: {
      y: 400,
      x: 470,
    },
  },
  {
    description: "This is a leg press",
    id: "lp",
    name: "Leg press",
    muscleGroups: ["quadriceps", "legs"],
    dimension: {
      height: 180,
      width: 190,
    },
    position: {
      y: 110,
      x: 140,
    },
  },
]

function selectMachine(machine: Machine) {
  if (activeMachine.value?.id !== machine.id) {
    showMenu.value = true
  } else {
    showMenu.value = !showMenu.value
  }
  activeMachine.value = machine
}
</script>

<template>
  <div>
    <MachineInfo v-model="isOpen" :machine="activeMachine" />
    <svg width="800" height="600" view-box="0 0 800 600" style="background-color: grey">
      <image href="../assets/map.svg" x="0" y="0" width="100%" height="100%" />
      <g v-for="machine in machines" :key="machine.name">
        <rect
          :id="machine.id"
          stroke="blue"
          fill="#000000"
          :x="machine.position.x"
          :y="machine.position.y"
          :width="machine.dimension.width"
          :height="machine.dimension.height"
          style="cursor: pointer"
          @click="selectMachine(machine)"
        />
        <text
          :x="machine.position.x + machine.dimension.height / 2"
          :y="machine.position.y + machine.dimension.width / 2"
          fill="red"
          style="pointer-events: none"
        >
          {{ machine.name }}
        </text>
      </g>
    </svg>
    <v-menu
      v-if="activeMachine"
      v-model="showMenu"
      :activator="`#${activeMachine.id}`"
      :close-on-content-click="false"
      offset="10"
      :open-on-click="false"
      location="left"
      persistent
    >
      <v-card min-width="150" max-width="300">
        <v-card-title>
          <div class="d-flex align-center justify-space-between">
            <p>{{ activeMachine.name }}</p>
            <v-btn
              @click="showMenu = false"
              class="ml-4"
              color="error"
              variant="text"
              icon="mdi-close"
            ></v-btn>
          </div>
        </v-card-title>
        <v-card-subtitle> {{ activeMachine.muscleGroups.join(", ") }} </v-card-subtitle>
        <v-card-text>
          <v-spacer></v-spacer>
          <v-btn @click="isOpen = true">More details</v-btn>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>
