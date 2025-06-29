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
const dragginMachine = ref<Machine>()
const draggingOffset = reactive({
  x: 0,
  y: 0,
})

const svgContainer = ref<HTMLElement | null>(null)
const svgElement = ref<SVGElement | null>(null)
const panzoomInstance = ref<PanzoomObject | null>(null)

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

onMounted(() =>
  machineService.get().then(async (res) => {
    machines.value = res.map((m) => ({ ...m, is_origin: false }))
    if (props.id) {
      const originMachine = machines.value.find((m) => m.id === Number(props.id))
      if (!originMachine) return
      originMachine.is_origin = true
    }

    await nextTick()
    setupPanZoom()
  }),
)

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

    <div v-if="editMode && machineEdit">
      <NumberSlider v-model="machinePosition.width" :step="5" :max="500" label="Width" />
      <NumberSlider v-model="machinePosition.height" :step="5" :max="500" label="Heigth" />
      X: {{ machinePosition.position_x }} Y: {{ machinePosition.position_y }}
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
