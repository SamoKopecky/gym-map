<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, reactive, nextTick } from "vue"
import NumberSlider from "@/components/NumberSlider.vue"
import type { MapMachine } from "@/types/machine"
import { MAP_HEIGHT, MAP_WIDTH } from "@/constants"
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
import { useMap } from "@/composables/useMap"

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
const bgSvgGroup = ref<SVGElement | null>(null)
const { panzoomInstance, setupPanzoomNoKey, setupPanzoomOnKeydown, destroyPanZoom } = usePanzoom(
  mainSvg,
  mainSvgContainer,
)
const { addWall, addEventHandlerToMove, removeEventHandlerToMove } = useMap(
  panzoomInstance,
  bgSvgGroup,
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
    bgSvgGroup.value?.querySelectorAll("line").forEach((line) => {
      addEventHandlerToMove(line)
    })
  } else {
    // View mode
    setupPanzoomNoKey()
    bgSvgGroup.value?.querySelectorAll("line").forEach((line) => {
      removeEventHandlerToMove(line)
    })
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

function saveMap() {
  if (!bgSvgGroup.value) return

  const serializer = new XMLSerializer()
  const serializedSvg = serializer.serializeToString(bgSvgGroup.value)

  const formData = new FormData()
  formData.append("file", serializedSvg)

  mapFileService.postFile(formData)
}

onMounted(() => {
  mapFileService.getMap().then(async (map) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(map, "image/svg+xml")
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
      setupPanzoomNoKey()
    })
    await nextTick()
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
            ? "Click a machine to edit its position & size (drag to move), hold space to drag the map"
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
      <v-btn @click="saveMap">save</v-btn>
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
}

/* Give a visual cue that the SVG is interactive */
.svg-container svg {
  cursor: move;
}
</style>
