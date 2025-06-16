<script setup lang="ts">
import type { Card, CardPanelName } from "@/types/card"
import { computed, type PropType } from "vue"
import { useRouter } from "vue-router"

const emit = defineEmits(["select:card", "create:card", "view:card", "unselect:card"])

const selectedCard = defineModel<Card>()

const router = useRouter()

const { name } = defineProps({
  name: {
    type: String as PropType<CardPanelName>,
    required: true,
  },
  cards: {
    type: Object as PropType<Card[]>,
    required: true,
  },
  useActions: {
    type: Boolean,
    required: false,
    default: true,
  },
  canEdit: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const panelTitle = computed(() => {
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
  <v-expansion-panel :value="name">
    <template #title>
      <v-btn
        v-if="selectedCard && name === 'Machines'"
        class="mr-2"
        variant="text"
        icon="mdi-map"
        @click.stop
        v-tooltip:bottom="'Highlight on map'"
        @click="router.push(`/map/${selectedCard.id}`)"
      />
      {{ panelTitle }}
    </template>
    <template #text>
      <v-container fluid>
        <v-btn v-if="canEdit" class="mb-3" text="add new" @click="emit('create:card')" />
        <v-row>
          <v-col v-for="card in cards" :key="card.id" cols="12" md="4" sm="6" lg="3">
            <v-card
              :title="card.name"
              :subtitle="card.subtitle"
              :variant="selectedCard?.id === card.id ? 'outlined' : undefined"
              @click="updateCardId(card)"
            >
              <v-card-title> </v-card-title>
              <template v-if="useActions" #append>
                <v-btn
                  v-if="canEdit"
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
                <v-chip
                  variant="outlined"
                  v-for="chip in card.chips"
                  :key="chip.text"
                  :text="chip.text"
                  :color="chip.color"
                />
                <v-spacer />
                {{ card.description }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-expansion-panel>
</template>
