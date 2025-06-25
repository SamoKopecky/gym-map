<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, reactive, nextTick } from "vue" // <-- Import onUnmounted and nextTick
import Panzoom from "@panzoom/panzoom" // <-- 1. Import Panzoom
import type { PanzoomObject } from "@panzoom/panzoom" // <-- Import its type for type safety

import NumberSlider from "@/components/NumberSlider.vue"
import type { MapMachine } from "@/types/machine"
import { machineService } from "@/services/machine"
import { getMachineHtmlId } from "@/utils/transformators"
import { type Position } from "@/types/machine"
import { useDebounceFn } from "@vueuse/core"
import { useRouter } from "vue-router"
import { pushToMachinesPage } from "@/utils/router"
import { useUser } from "@/composables/useUser"

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: undefined,
  },
})

const router = useRouter()
const { isAdmin } = useUser()

const machines = ref<MapMachine[]>()
const editMode = ref<boolean>(false)
const machineEdit = ref<MapMachine>()

const svgContainer = ref<HTMLElement | null>(null)
const svgElement = ref<SVGElement | null>(null)
const panzoomInstance = ref<PanzoomObject | null>(null)

const machinePosition = reactive<Position>({
  width: 0,
  height: 0,
  position_x: 0,
  position_y: 0,
})

function selectMachine(machine: MapMachine) {
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

onMounted(() =>
  machineService.get().then(async (res) => {
    machines.value = res.map((m) => ({ ...m, is_origin: false }))
    if (props.id) {
      const originMachine = machines.value.find((m) => m.id === Number(props.id))
      if (!originMachine) return
      originMachine.is_origin = true
    }

    await nextTick()

    if (svgElement.value && svgContainer.value) {
      const pz = Panzoom(svgElement.value, {
        canvas: true,
        minScale: 0.5,
        maxScale: 5,
      })
      panzoomInstance.value = pz // Save the instance

      svgContainer.value.addEventListener("wheel", pz.zoomWithWheel)
    }
  }),
)

onUnmounted(() => {
  panzoomInstance.value?.destroy()
})
</script>

<template>
  <div>
    <v-checkbox v-if="isAdmin" label="Edit machines" v-model="editMode" hide-details="auto" />
    <p v-if="editMode">Click a machine to edit</p>
    <p v-else>Click a machine for more info</p>
    <div v-if="editMode && machineEdit">
      <NumberSlider v-model="machinePosition.width" :step="5" :max="500" label="Width" />
      <NumberSlider v-model="machinePosition.height" :step="5" :max="500" label="Heigth" />
      <NumberSlider v-model="machinePosition.position_x" :step="5" :max="900" label="X" />
      <NumberSlider v-model="machinePosition.position_y" :step="5" :max="1206" label="Y" />
    </div>

    <div ref="svgContainer" class="svg-container">
      <svg ref="svgElement" width="900" height="1206" view-box="0 0 900 1206" class="svg-map">
        <image href="../assets/map.svg" x="0" y="0" width="100%" height="100%" />
        <g v-for="machine in machines" :key="machine.name">
          <rect
            :id="getMachineHtmlId(machine)"
            :stroke="machine.is_origin ? 'yellow' : ''"
            fill="#000000"
            :x="machine.position_x"
            :y="machine.position_y"
            :width="machine.width"
            :height="machine.height"
            style="cursor: pointer"
            @click="selectMachine(machine)"
            rx="8"
          />

          <foreignObject
            :x="machine.position_x"
            :y="machine.position_y"
            :width="machine.width"
            :height="machine.height"
            style="pointer-events: none"
          >
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              class="pa-1"
              :style="{
                color: machine.is_origin ? 'yellow' : 'white',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                wordBreak: 'normal',
              }"
            >
              {{ machine.name }}
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.svg-map {
  border-color: #ced4da;
  border-style: solid;
  border-width: 1px;

  display: block;
  margin: auto;
}
.svg-container {
  width: 100%;
  overflow: hidden; /* Panzoom handles the panning, so we hide native scrollbars */
}

/* Give a visual cue that the SVG is interactive */
.svg-container svg {
  cursor: move;
}
</style>
