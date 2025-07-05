import { type PanzoomObject } from "@panzoom/panzoom"
import { ref, type Ref } from "vue"
import { MAP_HEIGHT, MAP_WIDTH } from "@/constants"
import { randomNumberId } from "@/utils/other"
import { snap } from "@/utils/drag"

export function useMap(
  panzoomInstance: Ref<PanzoomObject | null>,
  bgSvgGroup: Ref<SVGElement | null>,
) {
  const moveEventHandlers = new Map<SVGLineElement, (event: MouseEvent) => void>()
  const activeLine = ref<SVGLineElement>()

  function addLine() {
    const newWall = document.createElementNS("http://www.w3.org/2000/svg", "line")
    newWall.setAttribute("id", `svg_${randomNumberId()}`)
    newWall.setAttribute("y2", (MAP_HEIGHT / 3).toString())
    newWall.setAttribute("x2", (MAP_WIDTH / 2).toString())
    newWall.setAttribute("y1", "0")
    newWall.setAttribute("x1", (MAP_WIDTH / 2).toString())
    newWall.setAttribute("stroke-width", "15")
    newWall.setAttribute("stroke", "#000")
    newWall.classList.add("panzoom-exclude")
    addEventHandlerToMove(newWall)

    bgSvgGroup.value?.appendChild(newWall)
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

      const svgPoint = getSVGPoint(event)

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
      // Clean up window-level events
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseup", stopDrag)
    }

    // Define the mousedown handler as a named function
    const startDrag = (event: MouseEvent) => {
      activeLine.value = element
      isDragging = true

      const svgPoint = getSVGPoint(event)

      const x1 = element.x1.animVal.value
      const y1 = element.y1.animVal.value
      const x2 = element.x2.animVal.value
      const y2 = element.y2.animVal.value

      dragOffsetX1 = svgPoint.x - x1
      dragOffsetY1 = svgPoint.y - y1
      diffX = x1 - x2
      diffY = y1 - y2

      window.addEventListener("mousemove", move)
      window.addEventListener("mouseup", stopDrag)
    }

    // Store the named handler in the Map, associated with the element
    moveEventHandlers.set(element, startDrag)

    // Add the event listener using the named handler
    element.addEventListener("mousedown", startDrag)
  }

  function removeEventHandlerToMove(element: SVGLineElement) {
    const handlerToRemove = moveEventHandlers.get(element)

    if (handlerToRemove) {
      // Use the retrieved handler to remove the event listener
      element.removeEventListener("mousedown", handlerToRemove)

      // Remove the element's entry from the Map to prevent memory leaks
      moveEventHandlers.delete(element)
    }
  }

  return { activeLine, addLine, addEventHandlerToMove, removeEventHandlerToMove }
}
