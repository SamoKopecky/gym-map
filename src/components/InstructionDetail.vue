<script setup lang="ts">
import { useUser } from "@/composables/useUser"
import { instructionService } from "@/services/instruction"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { type InstructionState, type Instruction } from "@/types/instruction.ts"
import { reactive } from "vue"
import { ref, watch } from "vue"

const props = defineProps({
  exerciseId: {
    type: Number,
    required: false,
    default: undefined,
  },
  userId: {
    type: String,
    required: false,
    default: undefined,
  },
})

const emit = defineEmits(["create:instruction"])

const active = defineModel<boolean>("active", { required: true })
const instruction = defineModel<Instruction>("instruction", { required: false })
const isLoading = ref(false)
const isFormValid = ref(false)

const { addNotification } = useNotificationStore()
const { isTrainer } = useUser()

const formData = reactive<InstructionState>({
  description: "",
})

watch(active, (newVal) => {
  if (instruction.value && newVal) {
    formData.description = instruction.value.description ?? ""
  } else {
    formData.description = ""
  }
})

function saveInstruction() {
  // TODO: User feedback on fail
  if (!isFormValid.value) return

  isLoading.value = true
  if (!instruction.value) {
    if (!props.exerciseId || !props.userId) {
      addNotification("Select an exercise first to create an instruction", "info")
      isLoading.value = false
      return
    }
    instructionService
      .post({ ...formData, exercise_id: props.exerciseId, user_id: props.userId })
      .then((res) => {
        emit("create:instruction", res)
        active.value = false
        addNotification("Instruction succesfully saved", "success")
      })
      .finally(() => {
        isLoading.value = false
      })
      .catch(() => {
        addNotification("Instruction failed to save", "error")
      })
  } else {
    instructionService
      .patch({
        id: instruction.value.id,
        ...formData,
      })
      .then(() => {
        Object.assign(instruction.value!, formData)
        active.value = false
        addNotification("Instruction edited", "success")
      })
      .finally(() => {
        isLoading.value = false
      })
      .catch(() => {
        addNotification("Instruction failed to save", "error")
      })
  }
}
</script>

<template>
  <v-dialog v-model="active" max-width="800px">
    <v-card>
      <v-card-title class="pa-4">
        <span class="text-h5">Add New Instruction</span>
      </v-card-title>

      <v-divider />

      <v-form v-model="isFormValid" @submit.prevent="saveInstruction">
        <v-card-text class="pt-4">
          <v-textarea
            :readonly="!isTrainer"
            v-model="formData.description"
            label="Instruction description"
            variant="outlined"
            rows="3"
            auto-grow
            prepend-inner-icon="mdi-note-text-outline"
            class="mb-2"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-btn variant="text" @click="active = false"> Cancel </v-btn>
          <v-spacer />
          <v-btn
            v-if="isTrainer"
            color="green"
            variant="flat"
            type="submit"
            :disabled="!isFormValid"
            :loading="isLoading"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
