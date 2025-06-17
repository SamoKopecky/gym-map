<script setup lang="ts">
import { useUser } from "@/composables/useUser"
import { instructionService } from "@/services/instruction"
import { type Instruction } from "@/types/instruction"
import { watchDebounced } from "@vueuse/core"

const instruction = defineModel<Instruction>({ required: true })
const { isTrainer } = useUser()

watchDebounced(
  () => instruction.value.description,
  (newDescription) => {
    instructionService.patch({ id: instruction.value.id, description: newDescription })
  },
  { debounce: 500 },
)
</script>

<template>
  <v-card variant="flat">
    <v-textarea
      class="ma-4"
      variant="outlined"
      auto-grow
      v-model="instruction.description"
      :readonly="!isTrainer"
    />
  </v-card>
</template>
