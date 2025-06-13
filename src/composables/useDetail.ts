import { computed, ref, type Ref } from "vue"
import type { ServiceBase } from "@/services/base"
import { onMounted } from "vue"
import type { Entity } from "@/types/base"
import type { Card } from "@/types/card"

export function useDetail<T extends Entity>(
  searchBar: Ref<string | undefined>,
  service: ServiceBase<any, any, T>,
  searchFunction: (searchText: string, card: T) => boolean,
  entityToCard: (entity: T) => Card,
) {
  const entities = ref<T[]>([]) as Ref<T[]>
  const activeEntity = ref<T>()
  const isEntityDetailActive = ref<boolean>(false)

  const searchedEntities = computed(() => {
    if (!searchBar.value) return entities.value

    return entities.value.filter((e) => searchFunction(searchBar.value!, e))
  })

  const cards = computed(() => {
    return searchedEntities.value.map((e) => entityToCard(e))
  })

  function handleEntitySelect(card: Card) {
    activeEntity.value = entities.value.find((e) => e.id == card.id)
    isEntityDetailActive.value = true
  }

  function handleEntityCreation() {
    activeEntity.value = undefined
    isEntityDetailActive.value = true
  }

  function fetchEntities() {
    service.get().then((res) => {
      entities.value = res
    })
  }

  onMounted(() => fetchEntities())

  return {
    cards,
    activeEntity,
    isEntityDetailActive,
    handleEntitySelect,
    handleEntityCreation,
    fetchEntities,
  }
}
