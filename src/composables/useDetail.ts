import { computed, ref, type Ref } from "vue"
import type { ServiceBase } from "@/services/base"
import type { Entity } from "@/types/base"
import type { Card } from "@/types/card"
import type { SearchData } from "@/types/other"
import { useNotificationStore } from "@/stores/useNotificationStore"

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

  const { addNotification } = useNotificationStore()

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

  function handleDelete(id: number) {
    service
      .delete(id)
      .then(() => {
        entities.value = entities.value.filter((e) => e.id !== id)
        addNotification("Deleted succesfully", "success")
      })
      .catch(() => addNotification("Deletion failed", "error"))
  }

  return {
    entities,
    cards,
    activeEntity,
    isEntityDetailActive,
    handleEntitySelect,
    handleEntityCreation,
    handleEntityApiCreation,
    handleDelete,
    fetchAllEntities,
  }
}
