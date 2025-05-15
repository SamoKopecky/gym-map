<script setup lang="ts">
import MachineInfo from '@/components/MachineInfo.vue'
import type { Machine } from '@/types/machine'
import { ref } from 'vue'

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
    position: {
      y: 400,
      x: 470,
    },
  },
  {
    description: 'This is a leg press',
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
  activeMachine.value = machine
  isOpen.value = true
}
</script>

<template>
  <div>
    <MachineInfo v-model="isOpen" :machine="activeMachine" />
    <svg width="800" height="600" view-box="0 0 800 600" style="background-color: grey">
      <image href="../assets/map.svg" x="0" y="0" width="100%" height="100%" />
      <rect
        v-for="machine in machines"
        :key="machine.name"
        :x="machine.position.x"
        :y="machine.position.y"
        :width="machine.dimension.width"
        :height="machine.dimension.height"
        style="cursor: pointer"
        fill="rgba(0, 0, 0, 0.0)"
        @click="selectMachine(machine)"
      ></rect>
    </svg>
  </div>
</template>
