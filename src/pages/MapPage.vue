<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, reactive, nextTick } from "vue"
import Panzoom from "@panzoom/panzoom"
import type { PanzoomObject } from "@panzoom/panzoom"
import NumberSlider from "@/components/NumberSlider.vue"
import type { MapMachine } from "@/types/machine"
import { machineService } from "@/services/machine"
import { getMachineHtmlId } from "@/utils/transformators"
import { type Machine, type Position } from "@/types/machine"
import { useDebounceFn } from "@vueuse/core"
import { useRouter } from "vue-router"
import { pushToMachinesPage } from "@/utils/router"
import { roundTo as snap } from "@/utils/drag"
import { useUser } from "@/composables/useUser"
import { mapFileService } from "@/services/mapFile"

const MAP_WIDTH = 1800
const MAP_HEIGHT = 3200

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: undefined,
  },
})

const router = useRouter()
const { isAdmin } = useUser()

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
const panzoomInstance = ref<PanzoomObject | null>(null)
const bgSvgGroup = ref<SVGElement | null>(null)

const machinePosition = reactive<Position>({
  width: 0,
  height: 0,
  position_x: 0,
  position_y: 0,
})

watch(editMode, (newVal) => {
  if (newVal) {
    const visibleLines = bgSvgGroup.value?.querySelectorAll("line")

    visibleLines?.forEach((visibleLine) => {
      // 1. Create the hitbox by cloning the visible line
      const hitbox = visibleLine.cloneNode() as SVGLineElement

      // 2. Style the hitbox to be wide and invisible
      hitbox.style.stroke = "transparent" // Makes the line see-through
      hitbox.style.strokeWidth = "20px" // A large, easy-to-click area
      hitbox.style.cursor = "pointer" // Shows a pointer on hover for better UX

      // 3. Add the hitbox to the SVG
      // It's good practice to add it right after the visible line.
      visibleLine.parentNode?.insertBefore(hitbox, visibleLine.nextSibling)

      // 4. Attach your drag handler to the HITBOX, not the visible line.
      // We need to modify it to move both lines.
      addEventHandlerToMove(hitbox)
    })
    destroyPanZoom()
  } else {
    const lines = bgSvgGroup.value?.querySelectorAll("line")
    lines?.forEach((line) => {
      console.log(line)
      line.setAttribute("stroke-width", "15")
    })
    setupPanZoom()
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
  dragginMachine.value = machines.value?.find((m) => m.id === machineId)
  if (!dragginMachine.value) return
  draggingOffset.x = event.offsetX - dragginMachine.value.position_x
  draggingOffset.y = event.offsetY - dragginMachine.value.position_y

  //@ts-expect-error correct type
  event.target?.addEventListener("mousemove", move)
}

const move = (event: MouseEvent) => {
  if (dragginMachine.value) {
    dragginMachine.value.position_x = snap(event.offsetX - draggingOffset.x)
    dragginMachine.value.position_y = snap(event.offsetY - draggingOffset.y)
  }
}

function drop(event: MouseEvent) {
  dragginMachine.value = undefined
  //@ts-expect-error correct type
  event.target?.removeEventListener("mousemove", move)
}

function setupPanZoom() {
  if (mainSvg.value && mainSvgContainer.value) {
    const pz = Panzoom(mainSvg.value, {
      canvas: true,
      minScale: 0.3,
      maxScale: 5,
    })

    panzoomInstance.value = pz
    mainSvgContainer.value.addEventListener("wheel", pz.zoomWithWheel)
  }
}

function destroyPanZoom() {
  panzoomInstance.value?.destroy()
}

function addEventHandlerToMove(element: SVGLineElement) {
  let isDragging = false

  // These offsets will now be in SVG coordinates
  let dragOffsetX1 = 0
  let dragOffsetY1 = 0

  // The difference between endpoints, also in SVG coordinates
  let diffX = 0
  let diffY = 0

  // Helper function to convert screen coords to SVG coords
  const getSVGPoint = (event: MouseEvent) => {
    const scale = panzoomInstance.value?.getScale()
    const pan = panzoomInstance.value?.getPan()
    return {
      x: (event.clientX - pan!.x) / scale!,
      y: (event.clientY - pan!.y) / scale!,
    }
  }

  const move = (event: MouseEvent) => {
    if (!isDragging) return

    // Convert current mouse position to SVG coordinates
    const svgPoint = getSVGPoint(event)

    // Calculate new positions using SVG coordinates only
    const newX1 = snap(svgPoint.x - dragOffsetX1)
    const newY1 = snap(svgPoint.y - dragOffsetY1)
    const newX2 = snap(newX1 - diffX)
    const newY2 = snap(newY1 - diffY)

    element.setAttribute("x1", newX1.toString())
    element.setAttribute("y1", newY1.toString())
    element.setAttribute("x2", newX2.toString())
    element.setAttribute("y2", newY2.toString())
  }

  const stopDrag = () => {
    isDragging = false
    window.removeEventListener("mousemove", move)
    window.removeEventListener("mouseup", stopDrag)
  }

  element.addEventListener("mousedown", (event: MouseEvent) => {
    isDragging = true

    // Get initial mouse position in SVG coordinates
    const svgPoint = getSVGPoint(event)

    const x1 = element.x1.animVal.value
    const y1 = element.y1.animVal.value
    const x2 = element.x2.animVal.value
    const y2 = element.y2.animVal.value

    // Calculate initial offsets in SVG coordinates
    dragOffsetX1 = svgPoint.x - x1
    dragOffsetY1 = svgPoint.y - y1

    // Store the difference between the two endpoints
    diffX = x1 - x2
    diffY = y1 - y2

    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", stopDrag)
  })
}

function addWall() {
  const newWall = document.createElementNS("http://www.w3.org/2000/svg", "line")
  newWall.setAttribute("id", "svg_1")
  newWall.setAttribute("y2", (MAP_HEIGHT / 3).toString())
  newWall.setAttribute("x2", (MAP_WIDTH / 2).toString())
  newWall.setAttribute("y1", "0")
  newWall.setAttribute("x1", (MAP_WIDTH / 2).toString())
  newWall.setAttribute("stroke-width", "15")
  newWall.setAttribute("stroke", "#000")
  addEventHandlerToMove(newWall)

  bgSvgGroup.value?.appendChild(newWall)
}

onMounted(() => {
  mapFileService.getMap().then((map) => {
    // Setup svgContent
    const parser = new DOMParser()
    const doc = parser.parseFromString(map, "text/html")
    const gElement = doc.querySelector("g")
    bgSvgData.value = gElement?.innerHTML

    machineService.get().then(async (res) => {
      machines.value = res.map((m) => ({ ...m, is_origin: false }))
      if (props.id) {
        const originMachine = machines.value.find((m) => m.id === Number(props.id))
        if (!originMachine) return
        originMachine.is_origin = true
      }

      await nextTick()
      setupPanZoom()
    })
  })
})

onUnmounted(() => destroyPanZoom())
</script>

<template>
  <div>
    <div class="d-flex justify-center align-center">
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
            ? "Click a machine to edit its position & size (drag to move)"
            : "Click a machine to see its exercises"
        }}
      </v-alert>
    </div>

    <div v-if="editMode">
      <NumberSlider v-model="machinePosition.width" :step="5" :max="500" label="Width" />
      <NumberSlider v-model="machinePosition.height" :step="5" :max="500" label="Heigth" />
      X: {{ machinePosition.position_x }} Y: {{ machinePosition.position_y }}
      <v-spacer></v-spacer>
      <v-btn @click="addWall"> Add wall </v-btn>
    </div>

    <div ref="mainSvgContainer" class="svg-container">
      <svg
        ref="mainSvg"
        :width="MAP_WIDTH"
        :height="MAP_HEIGHT"
        view-box="0 0 1800 3200"
        class="svg-map"
      >
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
            @mouseup="drop($event)"
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
  border-width: 3px;

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
