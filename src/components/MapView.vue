<script setup lang="ts">
import MachineInfo from "@/components/MachineInfo.vue"
import type { Machine } from "@/types/machine"
import { useDebounceFn } from "@vueuse/core"
import { nextTick } from "vue"
import { ref } from "vue"
import VueZoomable from "vue-zoomable"
import "vue-zoomable/dist/style.css"
import { isObject } from "vuetify/lib/util/helpers.mjs"

const showMenu = ref(false)
const isOpen = ref(false)
const activeMachine = ref<Machine>()
const machines: Machine[] = [
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

function selectMachine(machine: Machine) {
  if (activeMachine.value?.id !== machine.id) {
    showMenu.value = true
  } else {
    showMenu.value = !showMenu.value
  }
  activeMachine.value = machine
}

const closeMenuDebounce = useDebounceFn(() => {
  showMenu.value = false
}, 50)
</script>

<template>
  <div>
    <MachineInfo v-model="isOpen" :machine="activeMachine" />
    <VueZoomable selector="#panable" @panned="closeMenuDebounce">
      <div>
        <v-menu
          v-if="activeMachine"
          v-model="showMenu"
          :activator="`#${activeMachine.htmlId}`"
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
      <svg
        id="panable"
        width="900"
        height="1206"
        view-box="0 0 900 1206"
        style="background-color: grey"
      >
        <image href="../assets/map.svg" x="0" y="0" width="100%" height="100%" />
        <g v-for="machine in machines" :key="machine.name">
          <rect
            :id="machine.htmlId"
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
            :x="machine.position.x + machine.dimension.width / 3"
            :y="machine.position.y + machine.dimension.height / 2"
            fill="red"
            style="pointer-events: none"
          >
            {{ machine.name }}
          </text>
        </g>
      </svg>
    </VueZoomable>
  </div>
</template>
