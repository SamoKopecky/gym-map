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

// --- Props and basic setup (unchanged) ---
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

// --- Panzoom specific refs ---
// 2. Create template refs to get direct access to the DOM elements
const svgContainer = ref<HTMLElement | null>(null)
const svgElement = ref<SVGElement | null>(null)
// This will hold our Panzoom instance
const panzoomInstance = ref<PanzoomObject | null>(null)

// --- Reactive state for editing (unchanged) ---
const machinePosition = reactive<Position>({
  width: 0,
  height: 0,
  position_x: 0,
  position_y: 0,
})

// --- Functions for machine selection and updates (unchanged) ---
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

// --- Lifecycle Hooks (MODIFIED) ---
onMounted(() =>
  machineService.get().then(async (res) => {
    // <-- Make the callback async
    // Your existing logic to populate machines
    machines.value = res.map((m) => ({ ...m, is_origin: false }))
    if (props.id) {
      const originMachine = machines.value.find((m) => m.id === Number(props.id))
      if (!originMachine) return
      originMachine.is_origin = true
    }

    // 3. Wait for Vue to update the DOM after `machines.value` has changed
    await nextTick()

    // 4. NOW initialize Panzoom because the SVG and its content exist
    if (svgElement.value && svgContainer.value) {
      const pz = Panzoom(svgElement.value, {
        canvas: true, // Recommended for performance, uses parent for event listeners
        minScale: 0.5,
        maxScale: 5,
      })
      panzoomInstance.value = pz // Save the instance

      // The panzoom instance listens for pointer events, but for wheel zoom,
      // it's best to attach the listener to the container.
      svgContainer.value.addEventListener("wheel", pz.zoomWithWheel)
    }
  }),
)

// 5. Clean up when the component is unmounted to prevent memory leaks
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
      <svg
        ref="svgElement"
        width="900"
        height="1206"
        view-box="0 0 900 1206"
        style="background-color: grey"
      >
        <image href="../assets/map.svg" x="0" y="0" width="100%" height="100%" />
        <g v-for="machine in machines" :key="machine.name">
          <rect
            :id="getMachineHtmlId(machine)"
            :stroke="machine.is_origin ? 'red' : 'blue'"
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
            :fill="machine.is_origin ? 'white' : 'red'"
            style="pointer-events: none"
          >
            {{ machine.name }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
/* STYLE MODIFICATION */
.svg-container {
  width: 100%;
  overflow: hidden; /* Panzoom handles the panning, so we hide native scrollbars */
  border: 1px solid #ddd; /* Optional: just to see the container bounds */
}

/* Give a visual cue that the SVG is interactive */
.svg-container svg {
  cursor: move;
}
</style>
