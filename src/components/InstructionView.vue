<script setup lang="ts">
import { useUser } from "@/composables/useUser"
import { instructionService } from "@/services/instruction"
import { type Instruction } from "@/types/instruction"
import { watchDebounced } from "@vueuse/core"
import { computed } from "vue"

const instruction = defineModel<Instruction>({ required: true })
const { isTrainer, userId, isAdmin } = useUser()
const canEdit = computed(() => {
  const trainerOwns = isTrainer.value && userId === instruction.value.user_id
  // True if either train owns the instruction or its an admin
  return trainerOwns || isAdmin.value
})

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
      :readonly="!canEdit"
    />
  </v-card>
</template>
