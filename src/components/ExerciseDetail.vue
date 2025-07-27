<script setup lang="ts">
import { exerciseService } from "@/services/exercise"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { type ExerciseState, type Exercise, Difficulty } from "@/types/exercise"
import { onMounted, reactive } from "vue"
import { ref, watch } from "vue"
import { difficultyToString } from "@/utils/transformators"
import { useUser } from "@/composables/useUser"
import { useI18n } from "vue-i18n"
import { categoryService } from "@/services/category"
import type { Category, CategoryProperties } from "@/types/category"
import { categoriesToPropertyIds } from "@/utils/categories"
import { computed } from "vue"
import type { Property } from "@/types/property"

// TODO: Make properties able to change name, creating new properties breaks existing links
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
const allCategories = ref<CategoryProperties[]>([])
const categoriesMap = computed(() => {
  const res = new Map<number, Property[]>()
  allCategories.value.forEach((c) => res.set(c.id, c.properties))
  return res
})
const categoriesOnly = computed(() => {
  const categoriesOnly: Category[] = []
  allCategories.value.forEach((c) => {
    categoriesOnly.push({ name: c.name, id: c.id })
  })
  return categoriesOnly
})

const { addNotification } = useNotificationStore()
const { isAdmin } = useUser()
const { t } = useI18n()

const formData = reactive<ExerciseState>({
  name: "",
  description: "",
  difficulty: undefined,
  active_categories: [],
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
    formData.difficulty = exercise.value.difficulty
    formData.active_categories = exercise.value.categories
  } else {
    formData.name = ""
    formData.description = ""
    formData.difficulty = undefined
    formData.active_categories = []
  }
})

function saveExercise() {
  if (!isFormValid.value) return

  isLoading.value = true
  if (!exercise.value) {
    if (!props.machineId) {
      addNotification(t("notification.selectMachineFirst"), "info")
      isLoading.value = false
      return
    }
    exerciseService
      .post({
        name: formData.name,
        property_ids: categoriesToPropertyIds(formData.active_categories),
        description: formData.description,
        machine_id: props.machineId,
      })
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
        name: formData.name,
        description: formData.description,
        difficulty: formData.difficulty,
        property_ids: categoriesToPropertyIds(formData.active_categories),
      })
      .then(() => {
        Object.assign(exercise.value!, formData)
        exercise.value!.property_ids = categoriesToPropertyIds(formData.active_categories)
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

// TODO: Cache or create store
onMounted(() => {
  categoryService.get().then((res) => (allCategories.value = res))
})
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

          <v-select
            :readonly="!isAdmin"
            v-model="formData.difficulty"
            :items="Object.values(Difficulty)"
            :item-title="(item) => t(difficultyToString(item))"
            :label="t('form.exerciseDifficulty')"
            return-object
            variant="outlined"
            prepend-inner-icon="mdi-speedometer"
            class="mb-2"
          ></v-select>

          <!-- TODO: use select here and figure out why v model behaves wierd -->
          <v-combobox
            :readonly="!isAdmin"
            v-model="formData.active_categories"
            :label="'Categories'"
            chips
            multiple
            variant="outlined"
            persistent-hint
            hide-details="auto"
            item-value="id"
            item-title="name"
            :items="categoriesOnly"
          />

          <v-combobox
            :readonly="!isAdmin"
            v-for="category in formData.active_categories"
            :key="category.id"
            v-model="category.properties"
            class="mt-2 ml-4"
            :label="category.name"
            chips
            multiple
            variant="outlined"
            persistent-hint
            hide-details="auto"
            item-value="id"
            item-title="name"
            :items="categoriesMap.get(category.id)"
          />
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
