<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, reactive, nextTick } from "vue"
import NumberSlider from "@/components/NumberSlider.vue"
import type { MapMachine } from "@/types/machine"
import { GRID_SIZE, MAP_HEIGHT, MAP_WIDTH, MAX_ZOOM, MIN_ZOOM } from "@/constants"
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
const panX = ref<number>()
const test = ref<number>()
const panY = ref<number>()
const zoom = ref<number>()
const origY = ref<number>()

const mainSvgContainer = ref<HTMLElement | null>(null)
const mainSvg = ref<SVGElement | null>(null)
const bgSvgGroup = ref<SVGElement | null>(null)
const { panzoomInstance, setupPanzoomNoKey, setupPanzoomOnKeydown, destroyPanZoom } = usePanzoom(
  mainSvg,
  mainSvgContainer,
)

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
    .then(async (map) => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(map, "image/svg+xml")
      const gElement = doc.querySelector("svg")
      bgSvgData.value = gElement?.innerHTML

      startY.value = mainSvg.value?.getBoundingClientRect().y

      machineService.get().then(async (res) => {
        machines.value = res.map((m) => ({ ...m, is_origin: false }))
        if (props.id) {
          const originMachine = machines.value.find((m) => m.id === Number(props.id))
          if (!originMachine) return
          originMachine.is_origin = true
        }

        await nextTick()
        setupPanzoomNoKey()
      })
    })
    .finally(async () => {
      await nextTick()
      resetMap()
    })
})

onUnmounted(() => {
  const styleElement = document.getElementById(styleTagId)

  if (styleElement) {
    document.head.removeChild(styleElement)
  }
  destroyPanZoom()
})

function calulcateScaledTopLeftCorner(scale: number, maxDim: number) {
  const res = ((maxDim / 2) * (1 - scale)) / scale
  return res
}

function resetMap() {
  if (!startY.value) return
  const scale = Math.max(window.innerWidth / MAP_WIDTH, MIN_ZOOM)
  // const scale = 0.4
  // works for scale 1
  panzoomInstance.value?.zoom(scale)
  // getPan()
  // works for scale 1
  const additionalY = (MAP_HEIGHT * scale - window.innerHeight + startY.value) / scale

  panzoomInstance.value?.pan(
    -calulcateScaledTopLeftCorner(scale, MAP_WIDTH),
    -calulcateScaledTopLeftCorner(scale, MAP_HEIGHT) - additionalY,
  )
}
</script>

<template>
  <div>
    <v-fab position="absolute" location="bottom right" absolute size="large" icon>
      <v-icon>mdi-cross</v-icon>
    </v-fab>
    <div class="d-flex justify-center align-center">
      <v-btn @click="resetMap" class="mx-2"> Reset map </v-btn>
      <v-switch
        v-if="isAdmin"
        label="Edit machines"
        v-model="editMode"
        hide-details
        color="yellow"
        class="mr-2 mb-0"
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
            : "Click a machine to see its exercises, use scroll whell to zoom in & out"
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
            :stroke="machine.is_origin ? 'yellow' : ''"
            fill="#000000"
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
  border-width: 20px;

  display: block;
  margin: auto;
}
.svg-container {
  width: 100%;
}

/* Give a visual cue that the SVG is interactive */
.svg-container svg {
  cursor: move;
}
</style>
