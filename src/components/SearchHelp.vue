<script setup lang="ts">
import { useI18n } from "vue-i18n"

const active = defineModel<boolean>({ default: false, required: true })

const { t } = useI18n()
</script>

<template>
  <v-dialog v-model="active" max-width="500" scrollable>
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon class="me-3" color="primary">mdi-help-circle-outline</v-icon>
        <span>{{ t("searchHelp.title") }}</span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="$emit('update:modelValue', false)"
        />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <div class="mb-4">
          <p class="text-body-2 mb-3">{{ t("searchHelp.description") }}</p>
        </div>

        <v-list density="compact" class="pa-0">
          <v-list-subheader class="px-0 text-primary font-weight-medium">
            {{ t("searchHelp.machinesSection") }}
          </v-list-subheader>

          <v-list-item class="px-2 py-1">
            <template #prepend>
              <v-icon size="18" color="success">mdi-check-circle</v-icon>
            </template>
            <v-list-item-title class="text-body-2">
              {{ t("searchHelp.machineName") }}
            </v-list-item-title>
          </v-list-item>

          <v-list-item class="px-2 py-1">
            <template #prepend>
              <v-icon size="18" color="success">mdi-check-circle</v-icon>
            </template>
            <v-list-item-title class="text-body-2">
              {{ t("searchHelp.muscleGroups") }}
            </v-list-item-title>
          </v-list-item>

          <v-divider class="my-2" />

          <v-list-subheader class="px-0 text-primary font-weight-medium">
            {{ t("searchHelp.exercisesSection") }}
          </v-list-subheader>

          <v-list-item class="px-2 py-1">
            <template #prepend>
              <v-icon size="18" color="success">mdi-check-circle</v-icon>
            </template>
            <v-list-item-title class="text-body-2">
              {{ t("searchHelp.exerciseName") }}
            </v-list-item-title>
          </v-list-item>

          <v-list-item class="px-2 py-1">
            <template #prepend>
              <v-icon size="18" color="success">mdi-check-circle</v-icon>
            </template>
            <v-list-item-title class="text-body-2">
              {{ t("searchHelp.muscleGroups") }}
            </v-list-item-title>
          </v-list-item>

          <v-list-item class="px-2 py-1">
            <template #prepend>
              <v-icon size="18" color="info">mdi-filter-variant</v-icon>
            </template>
            <v-list-item-title class="text-body-2">
              {{ t("searchHelp.difficultyFilter") }}
            </v-list-item-title>
          </v-list-item>

          <v-list-item class="px-2 py-1">
            <template #prepend>
              <v-icon size="18" color="info">mdi-tune</v-icon>
            </template>
            <v-list-item-title class="text-body-2">
              {{ t("searchHelp.propertyFilter") }}
            </v-list-item-title>
          </v-list-item>
        </v-list>

        <v-alert
          type="info"
          variant="tonal"
          density="compact"
          class="mt-4"
          :text="t('searchHelp.tip')"
        />
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn color="primary" variant="flat" @click="$emit('update:modelValue', false)">
          {{ t("button.gotIt") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
