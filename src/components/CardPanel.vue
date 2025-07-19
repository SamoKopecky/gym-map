<script setup lang="ts">
import type { Card, CardPanelName } from "@/types/card"
import { computed, ref, type PropType } from "vue"
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog.vue"
import { API_BASE_URL } from "@/services/base"

const deleteDialogActive = ref(false)
const deleteCard = ref<Card>()

const emit = defineEmits([
  "select:card",
  "create:card",
  "view:card",
  "unselect:card",
  "delete:card",
])

const selectedCard = defineModel<Card>()

const router = useRouter()
const { t } = useI18n()

const { name } = defineProps({
  name: {
    type: String as PropType<CardPanelName>,
    required: true,
  },
  cards: {
    type: Object as PropType<Card[]>,
    required: true,
  },
  areInstructions: {
    type: Boolean,
    required: false,
    default: false,
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
    return `${t("panel.selected")}${selectedCard.value.name}`
  }
})

const panelIcon = computed(() => {
  if (name === "Machines") return "mdi-dumbbell"
  if (name === "Exercises") return "mdi-weight-lifter"
  if (name === "Instructions") return "mdi-information-outline"
  return "mdi-view-grid"
})

const countIcon = computed(() => {
  if (name === "Machines") return "mdi-weight-lifter"
  if (name === "Exercises") return "mdi-information-outline"
  return "mdi-view-grid"
})

const singularName = computed(() => name.slice(0, -1))

function updateCardId(card: Card) {
  if (selectedCard.value?.id === card.id) {
    selectedCard.value = undefined
    emit("unselect:card")
  } else {
    emit("select:card", card, name)
    selectedCard.value = card
  }
}

function initialDeletion(card: Card) {
  deleteCard.value = card
  deleteDialogActive.value = true
}

function imageIdToUrl(id: string) {
  return `${API_BASE_URL}/media/${id}`
}
</script>

<template>
  <DeleteConfirmationDialog
    v-model="deleteDialogActive"
    confirm-text="Delete"
    @confirm="emit('delete:card', deleteCard)"
  >
    {{ t("dialog.confirmDelete") }} <strong>{{ deleteCard?.name }}</strong
    >{{ t("dialog.actionCannotBeUndone") }}

    <slot name="deletionWarning" />
  </DeleteConfirmationDialog>

  <v-expansion-panel :value="name">
    <v-expansion-panel-title>
      <v-icon :icon="panelIcon" start />
      <span class="font-weight-medium">{{ panelTitle }}</span>
      <v-btn
        v-if="selectedCard && name === 'Machines'"
        v-tooltip:top="t('button.highlightOnMap')"
        class="me-2"
        variant="text"
        size="small"
        icon="mdi-map-marker-outline"
        @click.stop="router.push(`/map/${selectedCard.id}`)"
      />
    </v-expansion-panel-title>

    <v-expansion-panel-text class="bg-grey-lighten-5">
      <v-btn v-if="canEdit" variant="tonal" color="primary" @click="emit('create:card')">
        <v-icon start>mdi-plus-circle-outline</v-icon>
        {{ t("panel.addNew") }}{{ singularName }}
      </v-btn>

      <v-container fluid>
        <v-row dense>
          <v-col v-for="card in cards" :key="card.id" cols="12" md="4" sm="6" lg="3">
            <v-card
              hover
              :class="{ 'selected-card': selectedCard?.id === card.id }"
              variant="outlined"
              @click="updateCardId(card)"
              style="transition: all 0.2s ease-out"
            >
              <template #title>
                <div class="d-flex align-center">
                  <v-chip v-if="!areInstructions" class="mr-2" size="small" variant="tonal">
                    <v-icon :icon="countIcon" start />
                    {{ card.count }}
                  </v-chip>
                  <span>{{ card.name }}</span>
                </div>
              </template>
              <template #append>
                <div class="d-flex align-center">
                  <div @click.stop v-if="!areInstructions">
                    <v-btn
                      v-if="canEdit"
                      v-tooltip:bottom="t('button.deleteCard')"
                      size="small"
                      variant="text"
                      color="error"
                      icon="mdi-delete"
                      @click="initialDeletion(card)"
                    />
                    <v-btn
                      v-tooltip:bottom="canEdit ? t('button.editCard') : t('button.moreInfo')"
                      :icon="canEdit ? 'mdi-pencil-outline' : 'mdi-open-in-new'"
                      size="small"
                      variant="text"
                      @click="emit('view:card', card)"
                    />
                  </div>
                  <div v-else>
                    <v-avatar size="80">
                      <v-img v-if="card.imageId" :src="imageIdToUrl(card.imageId)" />
                    </v-avatar>
                  </div>
                </div>
              </template>

              <v-card-subtitle class="pb-1">
                {{ card.subtitle }}
              </v-card-subtitle>

              <v-card-text v-if="!areInstructions">
                <div class="mb-2">
                  <v-chip
                    v-for="chip in card.chips"
                    :key="chip.text"
                    :text="chip.text"
                    :color="chip.color"
                    variant="outlined"
                    class="me-1 mb-1"
                  />
                </div>
                <div class="text-body-2 text-medium-emphasis text-truncate">
                  {{ card.description }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<style scoped>
.selected-card {
  border-width: 2px;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
</style>
