<script setup lang="ts">
import type { Machine } from "@/types/machine"
import { isSearched } from "@/utils/search"
import { computed } from "vue"

const selectedCard = defineModel<Machine | undefined>("selected", { required: true })
const cards = defineModel<Machine[]>("cards", { required: true })

const { searchBar } = defineProps({
  searchBar: {
    type: String,
    required: false,
    default: undefined,
  },
})

const searchedCards = computed(() => {
  if (!searchBar) return cards.value

  return cards.value.filter((c) => isSearched(searchBar!, c))
})

function updateCardId(machine: Machine) {
  if (selectedCard.value?.id === machine.id) {
    selectedCard.value = undefined
  } else {
    selectedCard.value = machine
  }
}
</script>

<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="card in searchedCards" :key="card.id" cols="12" md="4" sm="6" lg="3">
        <v-card
          :title="card.name"
          :subtitle="card.muscleGroups.join(', ')"
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
