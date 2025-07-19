<script setup lang="ts">
import { exerciseService } from "@/services/exercise"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { type ExerciseState, type Exercise, Difficulty } from "@/types/exercise"
import { reactive } from "vue"
import { ref, watch } from "vue"
import { difficultyToString } from "@/utils/transformators"
import { useUser } from "@/composables/useUser"
import { useI18n } from "vue-i18n"

const MAX_NAME_CHARS = 255

const props = defineProps({
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
const { isAdmin } = useUser()
const { t } = useI18n()

const formData = reactive<ExerciseState>({
  name: "",
  description: "",
  muscle_groups: [],
  difficulty: undefined,
})

const nameRules = [
  (value: string) => !!value || t("validation.exerciseNameRequired"),
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
      addNotification(t("notification.selectMachineFirst"), "info")
      isLoading.value = false
      return
    }
    exerciseService
      .post({ ...formData, machine_id: props.machineId })
      .then((res) => {
        emit("create:exercise", res)
        addNotification(t("notification.exerciseSuccessfullySaved"), "success")
        active.value = false
      })
      .finally(() => {
        isLoading.value = false
      })
      .catch(() => {
        addNotification(t("notification.exerciseFailedToSave"), "error")
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
        addNotification(t("notification.exerciseEdited"), "success")
      })
      .finally(() => {
        isLoading.value = false
      })
      .catch(() => {
        addNotification(t("notification.exerciseFailedToSave"), "error")
      })
  }
}
</script>

<template>
  <v-dialog v-model="active" max-width="800px">
    <v-card>
      <v-card-title class="pa-4">
        <span class="text-h5">{{ t("dialog.addNewExercise") }}</span>
      </v-card-title>

      <v-divider />

      <v-form v-model="isFormValid" @submit.prevent="saveExercise">
        <v-card-text class="pt-4">
          <v-text-field
            :readonly="!isAdmin"
            v-model="formData.name"
            :label="t('form.exerciseName')"
            variant="outlined"
            :rules="nameRules"
            :counter="MAX_NAME_CHARS"
            prepend-inner-icon="mdi-dumbbell"
            class="mb-2"
          />

          <v-textarea
            :readonly="!isAdmin"
            v-model="formData.description"
            :label="t('form.exerciseDescription')"
            variant="outlined"
            rows="3"
            auto-grow
            prepend-inner-icon="mdi-note-text-outline"
            class="mb-2"
          />

          <v-combobox
            :readonly="!isAdmin"
            v-model="formData.muscle_groups"
            :label="t('form.muscleGroups')"
            chips
            multiple
            variant="outlined"
            prepend-inner-icon="mdi-weight-lifter"
            :hint="isAdmin ? t('form.muscleGroupsHint') : undefined"
            persistent-hint
            :class="[isAdmin ? 'mb-3' : '']"
          />

          <v-select
            :readonly="!isAdmin"
            v-model="formData.difficulty"
            :items="Object.values(Difficulty)"
            :item-title="difficultyToString"
            :label="t('form.exerciseDifficulty')"
            return-object
            variant="outlined"
            prepend-inner-icon="mdi-speedometer"
            class="mb-2"
          ></v-select>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-btn variant="text" @click="active = false">{{ t("button.cancel") }}</v-btn>
          <v-spacer />
          <v-btn
            v-if="isAdmin"
            color="green"
            variant="flat"
            type="submit"
            :disabled="!isFormValid"
            :loading="isLoading"
          >
            {{ t("button.save") }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
