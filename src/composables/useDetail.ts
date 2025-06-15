import { computed, ref, type Ref } from "vue"
import type { ServiceBase } from "@/services/base"
import { onMounted } from "vue"
import type { Entity } from "@/types/base"
import type { Card } from "@/types/card"
import type { SearchData } from "@/types/other"

export function useDetail<T extends Entity>(
  searchData: SearchData,
  // eslint-disable-next-line
  service: ServiceBase<any, any, T>,
  searchFunction: (searchData: SearchData, card: T) => boolean,
  entityToCard: (entity: T) => Card,
) {
  const entities = ref<T[]>([]) as Ref<T[]>
  const activeEntity = ref<T>()
  const isEntityDetailActive = ref<boolean>(false)

  const searchedEntities = computed(() => {
    return entities.value.filter((e) => searchFunction(searchData, e))
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

  function handleEntityApiCreation(entity: T) {
    entities.value.push(entity)
  }

  async function fetchAllEntities(): Promise<unknown> {
    return service.get().then((res) => {
      entities.value = res
    })
  }

  onMounted(() => fetchAllEntities())

  return {
    entities,
    cards,
    activeEntity,
    isEntityDetailActive,
    handleEntitySelect,
    handleEntityCreation,
    handleEntityApiCreation,
    fetchAllEntities,
  }
}
