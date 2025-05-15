<script lang="ts" setup>
import type { Machine } from '@/types/machine'
import type { PropType } from 'vue'

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  machine: {
    type: Object as PropType<Machine | undefined>,
    required: false,
    default: undefined,
  },
})

const emit = defineEmits(['update:modelValue'])

function exitButton() {
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="exitButton">
    <v-card :title="machine?.name" :text="machine?.description"> </v-card>
  </v-dialog>
</template>
