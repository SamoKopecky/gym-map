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
import { roundTo } from "@/utils/drag"
import { useUser } from "@/composables/useUser"
const map = `
<svg xmlns="http://www.w3.org/2000/svg">
 <g width="100%">
  <title>Layer 1</title>
  <line id="svg_12" y2="1100.0002" x2="1843.66716" y1="1098.33354" x1="1840.33383" stroke-width="15" stroke="#000" fill="none"/>
  <line id="svg_13" y2="1757.04402" x2="700.22219" y1="2194.7226" x1="700.22219" stroke-width="15" stroke="#000" fill="none"/>
  <line id="svg_17" y2="2191.33324" x2="1082.47211" y1="2191.33324" x1="692.55891" stroke-width="15" stroke="#000" fill="none"/>
  <line id="svg_19" y2="1084.67704" x2="1074.16959" y1="2184.72259" x1="1074.16959" stroke-width="15" stroke="#000" fill="none"/>
  <line id="svg_22" y2="732.50009" x2="-40.21678" y1="732.50009" x1="841.99998" stroke-width="15" stroke="#000" fill="none"/>
  <path id="svg_23" d="m466.37601,2202.45337l0,-438.52741" opacity="undefined" stroke-width="15" stroke="#000" fill="none"/>
  <path id="svg_24" d="m707.40065,1764.72234l363.32152,0" opacity="undefined" stroke-width="15" stroke="#000" fill="none"/>
  <text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_25" y="1917.22257" x="770.22219" stroke-width="0" stroke="#000" fill="#000000">Recepce</text>
  <line id="svg_26" y2="736.92317" x2="1800.23522" y1="736.92317" x1="1238.69263" stroke-width="15" stroke="#000" fill="none"/>
  <line id="svg_27" y2="214.75149" x2="1066.07715" y1="748.92316" x1="1066.07715" stroke-width="15" stroke="#000" fill="none"/>
  <path d="m1491.42859,571.14282c-2.85718,0 -8.34949,3.63849 -17.14282,5.71429c-19.6626,4.64172 -39.94409,6.13721 -60,8.57147c-28.50476,3.45972 -62.85718,11.42853 -94.28577,17.14282c-31.42859,5.71429 -60.36768,12.54175 -91.42859,20c-29.005,6.9646 -56.90332,15.81152 -88.57141,20c-34.10742,4.51111 -74.28564,2.85718 -108.57141,2.85718c-37.14288,0 -65.56207,-7.13928 -85.71429,-8.57147c-5.69989,-0.40509 -7.21643,-3.28381 -5.71429,-5.71429c3.35876,-5.43457 17.46655,-10.95734 34.28571,-22.85712c11.66199,-8.25104 25.71429,-20 37.14288,-31.42859c11.42859,-11.42853 24.83545,-24.03119 34.28577,-37.14282c11.20679,-15.54852 20,-31.42859 28.57141,-45.71429l2.85706,-5.71429" id="svg_37" stroke-width="0" stroke="#000" fill="none"/>
  <path d="m1014.28571,454c-14.28571,5.71426 -25.94202,10.9942 -37.14282,17.14285c-14.60413,8.01688 -26.36816,16.37036 -40,28.57141c-9.03235,8.08432 -22.85718,20.00003 -28.57147,28.57144l-2.85712,5.71429" id="svg_38" stroke-width="0" stroke="#000" fill="none"/>
  <line stroke-width="15" id="svg_40" y2="1088.28572" x2="-522.85717" y1="1088.28572" x1="-525.71431" stroke="#000" fill="none"/>
  <line id="svg_41" y2="2431.26054" x2="1537.14288" y1="731.14286" x1="1537.14288" stroke-width="15" stroke="#000" fill="none"/>
  <text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_42" y="1011.14286" x="1602.85717" stroke-width="0" stroke="#000" fill="#000000">satny muzi</text>
  <text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_43" y="2071.14289" x="1600.00003" stroke-width="0" stroke="#000" fill="#000000">satny zeny</text>
  <line id="svg_44" y2="1931.14289" x2="1811.5625" y1="1931.14289" x1="1537.14288" stroke-width="15" stroke="#000" fill="none"/>
  <line id="svg_45" y2="2194" x2="195.88062" y1="2194" x1="464" stroke-width="15" stroke="#000" fill="none"/>
  <line id="svg_46" y2="2426.12394" x2="200" y1="2184" x1="200" stroke-width="15" stroke="#000" fill="none"/>
  <line id="svg_47" y2="2846" x2="764" y1="2844" x1="762" stroke-width="15" stroke="#000" fill="none"/>
  <text xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" id="svg_48" y="2352" x="276" stroke-width="0" stroke="#000" fill="#000000">Vstup</text>
 </g>

</svg>
`

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: undefined,
  },
})

const router = useRouter()
const { isAdmin } = useUser()

const svgContent = ref<string>()
const machines = ref<MapMachine[]>()
const editMode = ref<boolean>(false)
const machineEdit = ref<MapMachine>()
const dragginMachine = ref<Machine>()
const draggingOffset = reactive({
  x: 0,
  y: 0,
})

const svgContainer = ref<HTMLElement | null>(null)
const svgElement = ref<SVGElement | null>(null)
const panzoomInstance = ref<PanzoomObject | null>(null)
const mapContainer = ref<SVGElement | null>(null)

const machinePosition = reactive<Position>({
  width: 0,
  height: 0,
  position_x: 0,
  position_y: 0,
})

watch(editMode, (newVal) => {
  if (newVal) {
    destroyPanZoom()
  } else {
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
    dragginMachine.value.position_x = roundTo(event.offsetX - draggingOffset.x, 5)
    dragginMachine.value.position_y = roundTo(event.offsetY - draggingOffset.y, 5)
  }
}

function drop(event: MouseEvent) {
  dragginMachine.value = undefined
  //@ts-expect-error correct type
  event.target?.removeEventListener("mousemove", move)
}

function setupPanZoom() {
  if (svgElement.value && svgContainer.value) {
    const pz = Panzoom(svgElement.value, {
      canvas: true,
      minScale: 0.5,
      maxScale: 5,
    })

    panzoomInstance.value = pz
    svgContainer.value.addEventListener("wheel", pz.zoomWithWheel)
  }
}

function destroyPanZoom() {
  panzoomInstance.value?.destroy()
}

onMounted(() => {
  const parser = new DOMParser()

  const doc = parser.parseFromString(map, "text/html")
  const svgElement = doc.querySelector("svg")
  const inner = svgElement?.innerHTML
  svgContent.value = inner
  machineService.get().then(async (res) => {
    machines.value = res.map((m) => ({ ...m, is_origin: false }))
    if (props.id) {
      const originMachine = machines.value.find((m) => m.id === Number(props.id))
      if (!originMachine) return
      originMachine.is_origin = true
    }

    await nextTick()
    if (!mapContainer.value) return
    console.log(mapContainer.value)

    const allLines = mapContainer.value.querySelectorAll("line")
    allLines.forEach((line) => {
      line.style = "cursor: move"
      line.addEventListener("click", (e) => {
        line.setAttribute("y1", String(line.y1.animVal.value + 20))
      })
    })
    await nextTick()
    setupPanZoom()
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
    </div>

    <div ref="svgContainer" class="svg-container">
      <svg ref="svgElement" width="1800" height="1206" view-box="0 0 1800 2412" class="svg-map">
        <g v-if="svgContent" v-html="svgContent" ref="mapContainer"></g>
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
