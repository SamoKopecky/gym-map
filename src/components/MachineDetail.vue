<script setup lang="ts">
import { machineService } from "@/services/machine"
import type { Machine } from "@/types/machine"
import { ref, watch } from "vue"

const MAX_NAME_CHARS = 255

defineProps({
  isReadOnly: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(["create:machine"])

const active = defineModel<boolean>("active", { required: true })
const machine = defineModel<Machine>("machine", { required: false })
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

watch(active, (newVal) => {
  if (machine.value && newVal) {
    machineName.value = machine.value.name
    machineDescription.value = machine.value.description
    muscleGroups.value = machine.value.muscle_groups ?? []
  } else {
    machineName.value = undefined
    machineDescription.value = undefined
    muscleGroups.value = []
  }
})

function saveMachine() {
  // TODO: User feedback on fail
  if (!machineName.value) return

  isLoading.value = true
  if (!machine.value) {
    machineService
      .post({
        name: machineName.value!,
        description: machineDescription.value,
        muscle_groups: muscleGroups.value,
      })
      .then(() => {
        emit("create:machine")
      })
      .finally(() => {
        isLoading.value = false
        active.value = false
      })
  } else {
    machineService
      .patch({
        id: machine.value.id,
        name: machineName.value,
        description: machineDescription.value,
        muscle_groups: muscleGroups.value,
      })
      .then(() => {
        machine.value!.name = machineName.value!
        machine.value!.description = machineDescription.value
        machine.value!.muscle_groups = muscleGroups.value
      })
      .finally(() => (isLoading.value = false))
    machine.value.description = machineDescription.value
  }
}
</script>

<template>
  <v-dialog v-model="active" max-width="800px">
    <v-card>
      <v-card-title class="pa-4">
        <span class="text-h5">Add New Machine</span>
      </v-card-title>

      <v-divider />

      <v-form v-model="isFormValid" @submit.prevent="saveMachine">
        <v-card-text class="pt-4">
          <v-text-field
            :readonly="isReadOnly"
            v-model="machineName"
            label="Machine name"
            variant="outlined"
            :rules="nameRules"
            :counter="MAX_NAME_CHARS"
            prepend-inner-icon="mdi-dumbbell"
            class="mb-2"
          />

          <v-textarea
            :readonly="isReadOnly"
            v-model="machineDescription"
            label="Machine description"
            variant="outlined"
            rows="3"
            auto-grow
            prepend-inner-icon="mdi-note-text-outline"
            class="mb-2"
          />

          <v-combobox
            :readonly="isReadOnly"
            v-model="muscleGroups"
            label="Muscle groups"
            chips
            multiple
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
            :disabled="!isFormValid || isReadOnly"
            :loading="isLoading"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
