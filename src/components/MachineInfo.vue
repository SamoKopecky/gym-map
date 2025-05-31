<script lang="ts" setup>
import type { Exercise, ChoiseItem, Machine, Trainer } from "@/types/machine"
import { ref, type PropType } from "vue"
import ChoiseList from "@/components/ChoiseList.vue"
import { computed } from "vue"
import type { ComputedRef } from "vue"
import { watch } from "vue"

defineProps({
  machine: {
    type: Object as PropType<Machine | undefined>,
    required: false,
    default: undefined,
  },
})

const active = defineModel<boolean>({ required: true })

const selectedExerciseId = ref<number>()
const selectedTrainerId = ref<number>()
const exercises = ref<Exercise[]>([
  {
    id: 1,
    availableVideos: 2,
    muscleGroups: ["feet", "legs"],
    name: "squat",
  },
  {
    id: 2,
    availableVideos: 5,
    muscleGroups: ["feet", "legs"],
    name: "bench press",
  },
  {
    id: 3,
    availableVideos: 3,
    muscleGroups: ["shoulders", "legs", "something else idk"],
    name: "deadlift",
  },
  {
    id: 4,
    availableVideos: 0,
    muscleGroups: ["back", "lats"],
    name: "pull ups",
  },
])
const trainers = ref<Trainer[]>([
  {
    id: 1,
    name: "samo",
    fullName: "Samuel Kopecky",
  },
  {
    id: 2,
    name: "Mirka",
    fullName: "Miroslava Liptakova",
  },
])

watch(active, (newActive: boolean) => {
  if (newActive) {
    selectedExerciseId.value = undefined
    selectedTrainerId.value = undefined
  }
})

const exerciseItems: ComputedRef<ChoiseItem[]> = computed(() => {
  return exercises.value.map((e) => {
    const i: ChoiseItem = {
      name: e.name,
      id: e.id,
      subtitle: e.muscleGroups.join(", "),
      append: `${e.availableVideos}`,
    }
    return i
  })
})

const trainerItems: ComputedRef<ChoiseItem[]> = computed(() => {
  return trainers.value.map((t) => {
    const i: ChoiseItem = {
      name: t.name,
      id: t.id,
      subtitle: t.fullName,
    }
    return i
  })
})

const setExerciseId = (exerciseId?: number) => {
  selectedExerciseId.value = exerciseId
  if (!exerciseId) {
    selectedTrainerId.value = undefined
  }
}
</script>

<template>
  <v-dialog v-if="machine" v-model="active">
    <v-card :title="machine.name">
      <template #title>
        <div class="d-flex align-center justify-space-between">
          <p>{{ machine.name }}</p>
          <v-btn
            @click="active = false"
            class="ml-4"
            color="error"
            variant="text"
            icon="mdi-close"
          ></v-btn>
        </div>
      </template>
      <template #text>
        <v-textarea variant="outlined" hide-details="auto" rows="3" label="Generic machine notes" />

        <h3>Exercises</h3>
        <ChoiseList
          v-model="exerciseItems"
          append-icon="mdi-weight-lifter"
          @set:item="setExerciseId"
        />

        <div v-if="selectedExerciseId">
          <v-divider></v-divider>
          <h3>Instructions</h3>
          <ChoiseList
            v-if="selectedExerciseId"
            v-model="trainerItems"
            @set:item="(trainerId?: number) => (selectedTrainerId = trainerId)"
          />
        </div>

        <div v-if="selectedTrainerId">
          <v-textarea
            variant="outlined"
            hide-details="auto"
            rows="3"
            label="Trainer specific instructions"
          />
          <div class="box mx-auto">video here :)</div>
        </div>
      </template>
    </v-card>
  </v-dialog>
</template>

<style lang="css" scoped>
.box {
  width: 400px;
  height: 200px;
  background-color: lightblue;
  border: 2px solid blue;
  padding: 10px;
  margin: 10px;
}
</style>
