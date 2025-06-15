<script setup lang="ts">
import { exerciseService } from "@/services/exercise"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { type ExerciseState, type Exercise, Difficulty } from "@/types/exercise"
import { reactive } from "vue"
import { ref, watch } from "vue"
import { difficultyToString } from "@/utils/transformators"

const MAX_NAME_CHARS = 255

const props = defineProps({
  isReadOnly: {
    type: Boolean,
    required: true,
  },
  machineId: {
    type: Number,
    required: false,
    default: undefined,
  },
})

const emit = defineEmits(["create:exercise"])

const active = defineModel<boolean>("active", { required: true })
const exercise = defineModel<Exercise>("exercise", { required: false })
const isLoading = ref(false)
const isFormValid = ref(false)

const { addNotification } = useNotificationStore()

const formData = reactive<ExerciseState>({
  name: "",
  description: "",
  muscle_groups: [],
  difficulty: undefined,
})

const nameRules = [
  (value: string) => !!value || "Exercise name is required.",
  (value: string) =>
    (value && value.length <= MAX_NAME_CHARS) ||
    `Name must be less than ${MAX_NAME_CHARS} characters.`,
]

watch(active, (newVal) => {
  if (exercise.value && newVal) {
    formData.name = exercise.value.name
    formData.description = exercise.value.description ?? ""
    formData.muscle_groups = exercise.value.muscle_groups ?? []
    formData.difficulty = exercise.value.difficulty
  } else {
    formData.name = ""
    formData.description = ""
    formData.muscle_groups = []
    formData.difficulty = undefined
  }
})

function saveExercise() {
  // TODO: User feedback on fail
  if (!isFormValid.value) return

  isLoading.value = true
  if (!exercise.value) {
    if (!props.machineId) {
      addNotification("Select a machine first to create an exercise", "info")
      isLoading.value = false
      return
    }
    exerciseService
      .post({ ...formData, machine_id: props.machineId })
      .then((res) => {
        emit("create:exercise", res)
        active.value = false
      })
      .finally(() => {
        isLoading.value = false
      })
  } else {
    exerciseService
      .patch({
        id: exercise.value.id,
        ...formData,
      })
      .then(() => {
        Object.assign(exercise.value!, formData)
        active.value = false
      })
      .finally(() => {
        isLoading.value = false
      })
  }
}
</script>

<template>
  <v-dialog v-model="active" max-width="800px">
    <v-card>
      <v-card-title class="pa-4">
        <span class="text-h5">Add New Exercise</span>
      </v-card-title>

      <v-divider />

      <v-form v-model="isFormValid" @submit.prevent="saveExercise">
        <v-card-text class="pt-4">
          <v-text-field
            :readonly="isReadOnly"
            v-model="formData.name"
            label="Exercise name"
            variant="outlined"
            :rules="nameRules"
            :counter="MAX_NAME_CHARS"
            prepend-inner-icon="mdi-dumbbell"
            class="mb-2"
          />

          <v-textarea
            :readonly="isReadOnly"
            v-model="formData.description"
            label="Exercise description"
            variant="outlined"
            rows="3"
            auto-grow
            prepend-inner-icon="mdi-note-text-outline"
            class="mb-2"
          />

          <v-combobox
            :readonly="isReadOnly"
            v-model="formData.muscle_groups"
            label="Muscle groups"
            chips
            multiple
            variant="outlined"
            prepend-inner-icon="mdi-weight-lifter"
            :hint="!isReadOnly ? 'Type and press Enter to add a new muscle group' : undefined"
            persistent-hint
            :class="[!isReadOnly ? 'mb-3' : '']"
          />

          <v-select
            :readonly="isReadOnly"
            v-model="formData.difficulty"
            :items="Object.values(Difficulty)"
            :item-title="difficultyToString"
            label="Exercise difficulty"
            return-object
            variant="outlined"
            prepend-inner-icon="mdi-speedometer"
            class="mb-2"
          ></v-select>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-btn variant="text" @click="active = false"> Cancel </v-btn>
          <v-spacer />
          <v-btn
            v-if="!isReadOnly"
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
