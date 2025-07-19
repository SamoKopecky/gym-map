<script setup lang="ts">
import { useI18n } from "vue-i18n"

const active = defineModel<boolean>({ required: true })

const emit = defineEmits(["confirm"])

const { t } = useI18n()

defineProps({
  confirmText: {
    type: String,
    required: true,
  },
})

function confirm() {
  active.value = false
  emit("confirm")
}
</script>

<template>
  <v-dialog v-model="active" max-width="500px">
    <v-card>
      <v-card-title class="text-h5 text-center">{{ t("dialog.areYouSure") }}</v-card-title>
      <v-card-text class="text-center">
        <slot />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="active = false">{{
          t("button.cancel")
        }}</v-btn>
        <v-btn color="red-darken-1" variant="tonal" @click="confirm"> {{ confirmText }}</v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
