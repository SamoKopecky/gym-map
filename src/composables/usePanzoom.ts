import { MAX_ZOOM, MIN_ZOOM } from "@/constants"
import Panzoom, { type PanzoomOptions, type PanzoomObject } from "@panzoom/panzoom"
import { onMounted } from "vue"
import { ref, type Ref } from "vue"

export function usePanzoom(
  mainSvg: Ref<SVGElement | null>,
  mainSvgContainer: Ref<HTMLElement | null>,
) {
  const panzoomInstance = ref<PanzoomObject | null>(null)

  onMounted(() => {
    setupPanzoom({
      canvas: true,
      minScale: MIN_ZOOM,
      maxScale: MAX_ZOOM,
    })
  })

  function onKeydown(e: KeyboardEvent) {
    if (e.code === "Space" && panzoomInstance.value) {
      // Prevent repeating last action
      panzoomInstance.value.setOptions({ disablePan: false })
    }
  }

  function onKeyup(e: KeyboardEvent) {
    if (e.code === "Space" && panzoomInstance.value) {
      // Prevent repeating last action
      panzoomInstance.value.setOptions({ disablePan: true })
    }
  }

  function setupPanzoom(options: Omit<PanzoomOptions, "force">) {
    if (mainSvg.value && mainSvgContainer.value) {
      const pz = Panzoom(mainSvg.value, options)

      panzoomInstance.value = pz
      mainSvgContainer.value.addEventListener("wheel", pz.zoomWithWheel)
    }
  }

  function setupPanzoomOnKeydown() {
    panzoomInstance.value?.setOptions({ disablePan: true })

    document.addEventListener("keydown", onKeydown)
    document.addEventListener("keyup", onKeyup)
  }

  function setupPanzoomNoKey() {
    panzoomInstance.value?.setOptions({ disablePan: false })
    document.removeEventListener("keydown", onKeydown)
    document.removeEventListener("keyup", onKeyup)
  }

  function destroyPanZoom() {
    panzoomInstance.value?.destroy()
  }

  return { panzoomInstance, setupPanzoomOnKeydown, setupPanzoomNoKey, destroyPanZoom }
}
