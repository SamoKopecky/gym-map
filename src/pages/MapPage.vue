<script setup lang="ts">
import NumberSlider from "@/components/NumberSlider.vue"
import type { Machine } from "@/types/machine"
import { onMounted, ref, watch } from "vue"
import { machineService } from "@/services/machine"
import { getMachineHtmlId } from "@/utils/transformators"
import { reactive } from "vue"
import { type Position } from "@/types/machine"
import { useDebounceFn } from "@vueuse/core"
import { useRouter } from "vue-router"
import { pushToMachinesPage } from "@/utils/router"

const router = useRouter()

const machines = ref<Machine[]>()
const editMode = ref<boolean>(true)
const machineEdit = ref<Machine>()

const machinePosition = reactive<Position>({
  width: 0,
  height: 0,
  position_x: 0,
  position_y: 0,
})

function selectMachine(machine: Machine) {
  if (editMode.value) {
    machineEdit.value = machine
    machinePosition.width = machine.width
    machinePosition.height = machine.height
    machinePosition.position_x = machine.position_x
    machinePosition.position_y = machine.position_y
  } else {
    pushToMachinesPage(router, machine.id)
  }
}

watch(machinePosition, (newPos) => {
  if (!machineEdit.value) return

  machineEdit.value.position_x = newPos.position_x
  machineEdit.value.position_y = newPos.position_y
  machineEdit.value.width = newPos.width
  machineEdit.value.height = newPos.height

  updatePositionDebounce(newPos)
})

const updatePositionDebounce = useDebounceFn((position: Position) => {
  machineService.patchPosition({
    id: machineEdit.value!.id,
    ...position,
  })
}, 500)

onMounted(() => machineService.get().then((res) => (machines.value = res)))
</script>

<template>
  <div>
    <v-checkbox label="Edit machines" v-model="editMode" />
    <div v-if="editMode && machineEdit">
      <NumberSlider v-model="machinePosition.width" :step="5" :max="500" label="Width" />
      <NumberSlider v-model="machinePosition.height" :step="5" :max="500" label="Heigth" />
      <NumberSlider v-model="machinePosition.position_x" :step="5" :max="900" label="X" />
      <NumberSlider v-model="machinePosition.position_y" :step="5" :max="1206" label="Y" />
    </div>

    <svg width="900" height="1206" view-box="0 0 900 1206" style="background-color: grey">
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
