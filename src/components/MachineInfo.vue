<script lang="ts" setup>
import type { ChoiseItem, Machine } from "@/types/machine"
import { ref, type PropType } from "vue"
import ChoiseList from "@/components/ChoiseList.vue"
import { watch } from "vue"
import { getTrainers } from "@/services/trainers"
import { exerciseToItem, trainerToItem } from "@/utils/transformators"
import { getExercises } from "@/services/exercise"

const props = defineProps({
  machine: {
    type: Object as PropType<Machine | undefined>,
    required: false,
    default: undefined,
  },
})

const active = defineModel<boolean>({ required: true })

const selectedExerciseId = ref<number>()
const selectedTrainerId = ref<number>()
const generalInfoText = ref<string>()
const trainerItems = ref<ChoiseItem[]>([])
const exerciseItems = ref<ChoiseItem[]>([])

watch(active, (newActive: boolean) => {
  if (newActive) {
    selectedExerciseId.value = undefined
    selectedTrainerId.value = undefined
  }
})

watch(
  () => props.machine,
  (newMachine?: Machine) => {
    if (!newMachine) {
      generalInfoText.value = ""
      exerciseItems.value = []
      return
    }
    generalInfoText.value = newMachine.description
    exerciseItems.value = getExercises(newMachine.id).map(exerciseToItem)
  },
)

watch(selectedExerciseId, (newId?: number) => {
  if (!newId) {
    trainerItems.value = []
    return
  }
  trainerItems.value = getTrainers(newId).map(trainerToItem)
})

watch(selectedTrainerId, (newId?: number) => {
  if (!newId) {
    generalInfoText.value = ""
    return
  }
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
        <v-textarea
          v-model="generalInfoText"
          variant="outlined"
          hide-details="auto"
          rows="3"
          label="Generic machine notes"
        />

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
          <div class="box mx-auto">video</div>
        </div>
      </template>
    </v-card>
  </v-dialog>
</template>

<style lang="css" scoped>
.box {
  width: 100px;
  height: 50px;
  background-color: lightblue;
  border: 2px solid blue;
  padding: 10px;
  margin: 10px;
}
</style>
