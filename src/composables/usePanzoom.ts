import Panzoom, { type PanzoomOptions, type PanzoomObject } from "@panzoom/panzoom"
import { ref, type Ref } from "vue"

export function usePanzoom(
  mainSvg: Ref<SVGElement | null>,
  mainSvgContainer: Ref<HTMLElement | null>,
) {
  const panzoomInstance = ref<PanzoomObject | null>(null)

  function onKeydown(e: KeyboardEvent) {
    if (e.code === "Space" && panzoomInstance.value) {
      e.preventDefault()
      panzoomInstance.value.setOptions({ disablePan: false })
    }
  }

  function onKeyup(e: KeyboardEvent) {
    if (e.code === "Space" && panzoomInstance.value) {
      e.preventDefault()
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
    panzoomInstance.value?.destroy()
    setupPanzoom({
      canvas: true,
      minScale: 0.3,
      maxScale: 5,
      disablePan: true,
    })

    document.addEventListener("keydown", onKeydown)
    document.addEventListener("keyup", onKeyup)
  }

  function setupPanzoomNoKey() {
    document.removeEventListener("keydown", onKeydown)
    document.removeEventListener("keyup", onKeyup)

    panzoomInstance.value?.destroy()
    setupPanzoom({
      canvas: true,
      minScale: 0.3,
      maxScale: 5,
    })
  }

  function destroyPanZoom() {
    panzoomInstance.value?.destroy()
  }

  return { panzoomInstance, setupPanzoomOnKeydown, setupPanzoomNoKey, destroyPanZoom }
}
