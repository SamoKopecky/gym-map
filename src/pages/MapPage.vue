<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, reactive } from "vue"
import NumberSlider from "@/components/NumberSlider.vue"
import type { MapMachine } from "@/types/machine"
import { GRID_SIZE, MAP_HEIGHT, MAP_WIDTH } from "@/constants"
import { machineService } from "@/services/machine"
import { getMachineHtmlId } from "@/utils/transformators"
import { type Machine, type Position } from "@/types/machine"
import { useDebounceFn } from "@vueuse/core"
import { useRouter } from "vue-router"
import { pushToMachinesPage } from "@/utils/router"
import { snap } from "@/utils/drag"
import { useUser } from "@/composables/useUser"
import { usePanzoom } from "@/composables/usePanzoom"
import { mapFileService } from "@/services/mapFile"
import { usePanning } from "@/composables/usePanning"

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: undefined,
  },
})

const router = useRouter()
const { isAdmin } = useUser()

const startY = ref<number>()
const bgSvgData = ref<string>()
const machines = ref<MapMachine[]>()
const editMode = ref<boolean>(false)
const machineEdit = ref<MapMachine>()
const dragginMachine = ref<Machine>()
const draggingOffset = reactive({
  x: 0,
  y: 0,
})

const mainSvgContainer = ref<HTMLElement | null>(null)
const mainSvg = ref<SVGElement | null>(null)
const bgSvgGroup = ref<SVGElement | null>(null)
const { panzoomInstance, setupPanzoomNoKey, setupPanzoomOnKeydown, destroyPanZoom } = usePanzoom(
  mainSvg,
  mainSvgContainer,
)
const { resetMap, panToMachine } = usePanning(startY, panzoomInstance)

const machinePosition = reactive<Position>({
  width: 0,
  height: 0,
  position_x: 0,
  position_y: 0,
})

watch(editMode, (newVal) => {
  if (newVal) {
    // Edit mode
    setupPanzoomOnKeydown()
  } else {
    // View mode
    setupPanzoomNoKey()
  }
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

function drag(event: MouseEvent, machineId: number) {
  if (editMode.value) {
    dragginMachine.value = machines.value?.find((m) => m.id === machineId)
    if (!dragginMachine.value) return
    draggingOffset.x = event.offsetX - dragginMachine.value.position_x
    draggingOffset.y = event.offsetY - dragginMachine.value.position_y

    document.addEventListener("mousemove", move)
  }
}

const move = (event: MouseEvent) => {
  if (dragginMachine.value) {
    dragginMachine.value.position_x = snap(event.offsetX - draggingOffset.x)
    dragginMachine.value.position_y = snap(event.offsetY - draggingOffset.y)
  }
}

function drop() {
  if (editMode.value) {
    dragginMachine.value = undefined
    document.removeEventListener("mousemove", move)
  }
}

// Define a unique ID for the style tag to easily find and remove it.
const styleTagId = "global-overflow-hidden-style"

// The CSS rules you want to apply.
const cssRules = `
  html,
  body,
  .v-application,
  .v-application__wrap,
  .v-layout,
  .v-main,
  .v-main__wrap {
    overflow: hidden !important;
  }
`

onMounted(() => {
  if (!document.getElementById(styleTagId)) {
    const styleElement = document.createElement("style")
    styleElement.id = styleTagId
    styleElement.textContent = cssRules

    document.head.appendChild(styleElement)
  }

  mapFileService
    .getMap()
    .then((map) => {
      mainSvg.value!.style.visibility = "hidden"
      const parser = new DOMParser()
      const doc = parser.parseFromString(map, "image/svg+xml")
      const gElement = doc.querySelector("svg")
      bgSvgData.value = gElement?.innerHTML

      startY.value = mainSvg.value?.getBoundingClientRect().y

      machineService.get().then((res) => {
        machines.value = res.map((m) => ({ ...m, is_origin: false }))
        if (props.id) {
          const originMachine = machines.value.find((m) => m.id === Number(props.id))
          if (!originMachine) return
          originMachine.is_origin = true
          setTimeout(() => {
            panToMachine(originMachine)
          }, 100)
        }

        setupPanzoomNoKey()
      })
    })
    .finally(() => {
      setTimeout(() => {
        if (!props.id) resetMap()
        mainSvg.value!.style.visibility = "visible"
      }, 100)
    })
})

onUnmounted(() => {
  const styleElement = document.getElementById(styleTagId)

  if (styleElement) {
    document.head.removeChild(styleElement)
  }
  destroyPanZoom()
})
</script>

<template>
  <div>
    <div class="d-flex justify-center align-center">
      <v-btn @click="resetMap" class="mx-2"> Reset map</v-btn>
      <v-switch
        v-if="isAdmin"
        label="Edit machines"
        v-model="editMode"
        hide-details
        color="yellow"
        class="mr-2 mb-0"
        @keydown.space.prevent
      />
      <v-alert
        :type="editMode ? 'warning' : 'info'"
        :icon="editMode ? 'mdi-pencil-circle-outline' : 'mdi-information-outline'"
        variant="tonal"
        density="compact"
        class="ma-0"
      >
        {{
          editMode
            ? "Click a machine to edit its position & size (drag to move), hold space to drag the map"
            : "Click a machine to see its exercises"
        }}
      </v-alert>
    </div>

    <div v-if="editMode">
      <NumberSlider v-model="machinePosition.width" :step="5" :max="MAP_WIDTH / 2" label="Width" />
      <NumberSlider
        v-model="machinePosition.height"
        :step="GRID_SIZE"
        :max="MAP_HEIGHT / 2"
        label="Heigth"
      />
      X: {{ machinePosition.position_x }} Y: {{ machinePosition.position_y }}
    </div>

    <div ref="mainSvgContainer" class="svg-container">
      <svg ref="mainSvg" :width="MAP_WIDTH" :height="MAP_HEIGHT" class="svg-map">
        <g v-if="bgSvgData" v-html="bgSvgData" ref="bgSvgGroup"></g>
        <g v-for="machine in machines" :key="machine.name">
          <rect
            :id="getMachineHtmlId(machine)"
            :class="['machine-rect', { 'origin-machine-highlight': machine.is_origin }]"
            :x="machine.position_x"
            :y="machine.position_y"
            :width="machine.width"
            :height="machine.height"
            style="cursor: pointer"
            @click="selectMachine(machine)"
            @mousedown="drag($event, machine.id)"
            @mouseup="drop"
            rx="8"
            class="panzoom-exclude"
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
                fontSize: '4em',
                color: machine.is_origin ? '#1976D2' : 'white',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                wordBreak: 'normal',
                fontWeight: machine.is_origin ? 500 : 400,
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
  border-radius: 24px;

  /* A very thin, subtle border to define the edge */
  border: 1px solid rgba(0, 0, 0, 0.1);

  /* A modern shadow to give depth and a "floating" effect */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

  /* Keep other styles */
  display: block;
  margin: auto;
}

.svg-container {
  width: 100%;
  cursor: move;
}

/* Base style for all machines for a softer look */
.machine-rect {
  fill: rgba(25, 25, 25, 0.8);
  stroke-width: 6px;
  stroke: transparent;
  transition:
    fill 0.3s ease,
    stroke 0.3s ease;
}

/* Subtle "breathing" animation for the border */
@keyframes breathing-animation {
  from {
    stroke-opacity: 1;
  }
  to {
    stroke-opacity: 0.4;
  }
}

/* Tonal highlight for the origin machine */
.origin-machine-highlight {
  fill: rgba(25, 118, 210, 0.2); /* Semi-transparent primary color (tonal) */
  stroke: #1976d2; /* Solid primary color */
  animation: breathing-animation 1.5s infinite alternate ease-in-out;
}
</style>
