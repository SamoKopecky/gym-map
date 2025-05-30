<script setup lang="ts">
import MachineInfo from '@/components/MachineInfo.vue'
import type { Machine } from '@/types/machine'
import { nextTick, ref } from 'vue'

const showMenu = ref(false)
const isOpen = ref(false)
const activeMachine = ref<Machine>()
const machines: Machine[] = [
  {
    description: 'This is a bench press',
    name: 'Bench press',
    dimension: {
      height: 180,
      width: 190,
    },
    id: 'bp',
    position: {
      y: 400,
      x: 470,
    },
  },
  {
    description: 'This is a leg press',
    id: 'lp',
    name: 'Leg press',
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
  if (activeMachine.value?.id != machine.id) {
    showMenu.value = true
  }
  activeMachine.value = machine
}
</script>

<template>
  <div>
    <MachineInfo v-model="isOpen" :machine="activeMachine" />
    <svg width="800" height="600" view-box="0 0 800 600" style="background-color: grey">
      <image href="../assets/map.svg" x="0" y="0" width="100%" height="100%" />
      <rect
        :id="machine.id"
        stroke="blue"
        fill="#000000"
        v-for="machine in machines"
        :key="machine.name"
        :x="machine.position.x"
        :y="machine.position.y"
        :width="machine.dimension.width"
        :height="machine.dimension.height"
        style="cursor: pointer"
        @click="selectMachine(machine)"
      />
    </svg>
    <v-menu
      v-model="showMenu"
      :activator="activeMachine ? `#${activeMachine.id}` : undefined"
      :close-on-content-click="false"
      :persistent="true"
      location="left"
    >
      <v-card min-width="150" max-width="300">
        <v-card-text>
          <v-btn @click="showMenu = false">close</v-btn>
          <v-btn @click="isOpen = true">show more</v-btn>
          test</v-card-text
        >
      </v-card>
    </v-menu>
  </div>
</template>
