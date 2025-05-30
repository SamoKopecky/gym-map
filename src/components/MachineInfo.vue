<script lang="ts" setup>
import type { Machine } from '@/types/machine'
import { ref, type PropType } from 'vue'

const active = defineModel<boolean>()

defineProps({
  machine: {
    type: Object as PropType<Machine | undefined>,
    required: false,
    default: undefined,
  },
})

const selectedTrainer = ref<string>()
const trainers = ref<string[]>(['samo', 'peter'])

const emit = defineEmits(['update:modelValue'])

function exitButton() {
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog v-if="machine" v-model="active">
    <v-card :title="machine.name">
      <template #text>
        <v-textarea
          variant="outlined"
          hide-details="auto"
          placeholder="Enter machine notes..."
          label="Machine notes"
        ></v-textarea>
        <v-divider class="my-4"></v-divider>
        <h3>How to Use</h3>
        <v-select
          v-model="selectedTrainer"
          :items="trainers"
          label="Select Trainer"
          variant="outlined"
          class="mt-2"
        ></v-select>

        <div v-if="selectedTrainer">
          <h4>Video from {{ selectedTrainer }}</h4>
          <p>No video available for this trainer.</p>
        </div>
        <p v-else>Select a trainer to view their video.</p>
      </template>
    </v-card>
  </v-dialog>
</template>
