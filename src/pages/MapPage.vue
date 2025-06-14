<script setup lang="ts">
import MapMachineMenu from "@/components/MapMachineMenu.vue"
import type { Machine } from "@/types/machine"
import { onMounted, ref } from "vue"
import { machineService } from "@/services/machine"
import { getMachineHtmlId } from "@/utils/transformators"

const showMenu = ref(false)
const activeMachine = ref<Machine>()
const machines = ref<Machine[]>()

function selectMachine(machine: Machine) {
  if (activeMachine.value?.id !== machine.id) {
    showMenu.value = true
  } else {
    showMenu.value = !showMenu.value
  }
  activeMachine.value = machine
}

onMounted(() => machineService.get().then((res) => (machines.value = res)))
</script>

<template>
  <div>
    <MapMachineMenu
      v-if="activeMachine"
      v-model:active="showMenu"
      v-model:machine="activeMachine"
    />

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
          :id="getMachineHtmlId(machine)"
          stroke="blue"
          fill="#000000"
          :x="machine.position_x"
          :y="machine.position_y"
          :width="machine.width"
          :height="machine.height"
          style="cursor: pointer"
          @click="selectMachine(machine)"
        />
        <text
          :x="machine.position_x + machine.width / 3"
          :y="machine.position_y + machine.height / 2"
          fill="red"
          style="pointer-events: none"
        >
          {{ machine.name }}
        </text>
      </g>
    </svg>
  </div>
</template>
