<script setup lang="ts">
import type { Card, CardPanelName } from "@/types/card"
import { computed, type PropType } from "vue"

const emit = defineEmits(["select:card", "create:card", "view:card", "unselect:card"])

const selectedCard = defineModel<Card>()

const { name } = defineProps({
  name: {
    type: String as PropType<CardPanelName>,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false,
  },
  cards: {
    type: Object as PropType<Card[]>,
    required: true,
  },
})

const machinesTitle = computed(() => {
  if (!selectedCard.value) {
    return name
  } else {
    return selectedCard.value.name
  }
})

function updateCardId(card: Card) {
  if (selectedCard.value?.id === card.id) {
    selectedCard.value = undefined
    emit("unselect:card")
  } else {
    emit("select:card", card, name)
    selectedCard.value = card
  }
}
</script>

<template>
  <v-expansion-panel :title="machinesTitle" :value="name">
    <template #text>
      <v-container fluid>
        <v-btn v-if="isAdmin" class="mb-3" text="add new" @click="emit('create:card')" />
        <v-row>
          <v-col v-for="card in cards" :key="card.id" cols="12" md="4" sm="6" lg="3">
            TODO Add icon to go to machine on map
            <v-card
              :title="card.name"
              :subtitle="card.subtitle"
              :variant="selectedCard?.id === card.id ? 'outlined' : undefined"
              @click="updateCardId(card)"
            >
              <template #append>
                <v-btn
                  v-if="isAdmin"
                  icon="mdi-pencil"
                  v-tooltip:bottom="'Edit card'"
                  variant="text"
                  @click="emit('view:card', card)"
                  @click.stop
                />
                <v-btn
                  v-else
                  icon="mdi-information-outline"
                  variant="text"
                  v-tooltip:bottom="'More info'"
                  @click="emit('view:card', card)"
                  @click.stop
                />
              </template>
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
