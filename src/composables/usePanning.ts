import { GRID_SIZE, MAP_HEIGHT, MAP_WIDTH, MIN_ZOOM } from "@/constants"
import type { Machine } from "@/types/machine"
import { getMachineHtmlId } from "@/utils/transformators"
import type { PanzoomObject } from "@panzoom/panzoom"
import type { Ref } from "vue"

export function usePanning(
  startY: Ref<number | undefined>,
  panzoomInstance: Ref<PanzoomObject | null>,
) {
  function getTargetScale() {
    return Math.max(window.innerWidth / MAP_WIDTH, MIN_ZOOM)
  }

  function getMaxYShift(scale: number): number {
    if (!startY.value) return 0
    return (MAP_HEIGHT * scale - window.innerHeight + startY.value) / scale
  }

  function getTopLeftCorner(scale: number, maxDim: number) {
    return ((maxDim / 2) * (1 - scale)) / scale
  }

  function resetMap() {
    if (!startY.value) return

    const scale = getTargetScale()
    panzoomInstance.value?.zoom(scale)
    const bottomCornerShift = (MAP_HEIGHT * scale - window.innerHeight + startY.value) / scale

    panzoomInstance.value?.pan(
      -getTopLeftCorner(scale, MAP_WIDTH),
      -getTopLeftCorner(scale, MAP_HEIGHT) - bottomCornerShift,
    )
  }

  function panToMachine(machine: Machine) {
    if (!startY.value) return

    const machineEl = document.getElementById(getMachineHtmlId(machine)) as unknown as SVGSVGElement
    if (!machineEl) return

    const scale = getTargetScale()
    const machineY = machineEl.y.animVal.value
    const machineX = machineEl.x.animVal.value
    const machineWidth = machineEl.width.animVal.value
    const scaledScreenSize = (window.innerHeight - startY.value) / scale

    resetMap()
    panzoomInstance.value?.pan(
      /*
    1. shift half way of the X screen (work with scale also), machine is origin is in half now
    2. subtract half of machine width to center screen based on the center of the machine
    3. subtract current X of the machine to work with offset
    */
      window.innerWidth / 2 / scale - machineWidth / 2 - machineX,
      /*
    1. Get max Y shift (used in resetMap) to get to the top of the map
    2. subract machine Y to get the viewbox to the top of the machine also subtract GRID_SIZE
    3. add half of the screen viewport to move the top of the machine to the middle
    4. can't figure out how to move the text to the middle
    */
      getMaxYShift(scale) - machineY - GRID_SIZE + scaledScreenSize / 2,
      {
        relative: true,
      },
    )
  }

  return { resetMap, panToMachine }
}
