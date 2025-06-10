<script setup lang="ts">
import type { Machine } from "@/types/machine"
import { isSearched } from "@/utils/search"
import { computed, ref } from "vue"

const cards = defineModel<Machine[]>("cards", { required: true })
const addNewDialogActive = defineModel<boolean>("cardDialog", { required: true })

const emit = defineEmits(["select:card"])

const selectedCard = ref<Machine | undefined>()

const { searchBar, name } = defineProps({
  searchBar: {
    type: String,
    required: false,
    default: undefined,
  },
  name: {
    type: String,
    required: true,
  },
})

const searchedCards = computed(() => {
  if (!searchBar) return cards.value

  return cards.value.filter((c) => isSearched(searchBar!, c))
})
const machinesTitle = computed(() => {
  if (!selectedCard.value) {
    return name
  } else {
    return selectedCard.value.name
  }
})

function updateCardId(machine: Machine) {
  if (selectedCard.value?.id === machine.id) {
    selectedCard.value = undefined
  } else {
    emit("select:card", name)
    selectedCard.value = machine
  }
}
</script>

<template>
  <v-expansion-panel :title="machinesTitle" :value="name">
    <template #text>
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="4" sm="6" lg="3">
            <v-card title="add new" @click="addNewDialogActive = true" />
          </v-col>
          <v-col v-for="card in searchedCards" :key="card.id" cols="12" md="4" sm="6" lg="3">
            <v-card
              :title="card.name"
              :subtitle="card.muscle_groups?.join(', ')"
              :variant="selectedCard?.id === card.id ? 'outlined' : undefined"
              @click="updateCardId(card)"
            >
              <v-card-text>
                {{ card.description }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-expansion-panel>
</template>
