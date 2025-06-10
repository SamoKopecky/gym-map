<script setup lang="ts">
import { machineService } from "@/services/machine"
import { ref } from "vue"

const MAX_NAME_CHARS = 255

const emit = defineEmits(["create:machine"])

const active = defineModel<boolean>({ required: true })
const isLoading = ref(false)
const isFormValid = ref(false)

const machineName = ref<string>()
const machineDescription = ref<string>()
const muscleGroups = ref<string[]>([])

const nameRules = [
  (value: string) => !!value || "Machine name is required.",
  (value: string) =>
    (value && value.length <= MAX_NAME_CHARS) ||
    `Name must be less than ${MAX_NAME_CHARS} characters.`,
]

function createMachine() {
  // TODO: User feedback on fail
  if (!machineName.value) return
  isLoading.value = true
  machineService
    .post({
      name: machineName.value!,
      description: machineDescription.value,
      muscle_groups: muscleGroups.value,
    })
    .then(() => emit("create:machine"))
    .finally(() => {
      isLoading.value = false
      active.value = false
    })
}
</script>

<template>
  <v-dialog v-model="active" max-width="800px">
    <v-card>
      <v-card-title class="pa-4">
        <span class="text-h5">Add New Machine</span>
      </v-card-title>

      <v-divider />

      <v-form v-model="isFormValid" @submit.prevent="createMachine">
        <v-card-text class="pt-4">
          <v-text-field
            v-model="machineName"
            label="Machine name"
            variant="outlined"
            :rules="nameRules"
            :counter="MAX_NAME_CHARS"
            clearable
            prepend-inner-icon="mdi-dumbbell"
            class="mb-2"
          />

          <v-textarea
            v-model="machineDescription"
            label="Machine description"
            variant="outlined"
            rows="3"
            auto-grow
            clearable
            prepend-inner-icon="mdi-note-text-outline"
            class="mb-2"
          />

          <v-combobox
            v-model="muscleGroups"
            label="Muscle groups"
            chips
            multiple
            clearable
            variant="outlined"
            prepend-inner-icon="mdi-weight-lifter"
            hint="Type and press Enter to add a new muscle group"
            persistent-hint
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-btn variant="text" @click="active = false"> Cancel </v-btn>
          <v-spacer />
          <v-btn
            color="green"
            variant="flat"
            type="submit"
            :disabled="!isFormValid"
            :loading="isLoading"
          >
            Create Machine
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
