<script setup lang="ts">
import { type Card, type CardPanelName } from "@/types/card"
import { ref } from "vue"
import CardPanel from "@/components/CardPanel.vue"
import MachineDetail from "@/components/MachineDetail.vue"
import InstructionDetail from "@/components/InstructionDetail.vue"
import InstructionView from "@/components/InstructionView.vue"
import { onMounted } from "vue"
import {
  exerciseToCard,
  machineToCard,
  difficultyToColor,
  instructionToCard,
  difficultyToString,
} from "@/utils/transformators"
import { isExerciseSearched, isInstructionSearched, isMachineSearched } from "@/utils/search"
import { useDetail } from "@/composables/useDetail"
import { machineService } from "@/services/machine"
import { exerciseService } from "@/services/exercise"
import ExerciseDetail from "@/components/ExerciseDetail.vue"
import { Difficulty } from "@/types/exercise"
import { reactive } from "vue"
import { type SearchData } from "@/types/other"
import { instructionService } from "@/services/instruction"
import { computed } from "vue"
import { useUser } from "@/composables/useUser"
import type { Machine } from "@/types/machine"
import type { Exercise } from "@/types/exercise"

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: undefined,
  },
})

const searchData = reactive<SearchData>({
  difficulties: [],
  text: "",
})
const panelsShow = ref<CardPanelName[]>(["Machines", "Exercises"])
const selectedMachineCard = ref<Card>()
const selectedExerciseCard = ref<Card>()
const selectedInstructionCard = ref<Card>()

const selectedInstruction = computed(() => {
  if (!selectedInstructionCard.value) return

  return instructions.value.find((i) => i.id === selectedInstructionCard.value?.id)
})

const { userId } = useUser()

function handleCardSelect(card: Card, panelName: CardPanelName) {
  if (panelName === "Machines") {
    handleMachinesCardSelect(card)
  } else if (panelName === "Exercises") {
    handleExerciseCardSelect(card)
  } else if (panelName === "Instructions") {
    handleInstructionCardSelect()
  }
}

function handleInstructionCardSelect() {
  panelsShow.value = []
}

function handleExerciseCardSelect(card: Card) {
  panelsShow.value = ["Instructions"]

  const exercise = exercises.value.find((m) => m.id === card.id)
  if (!exercise) return
  // Select machine
  selectedMachineCard.value = machines.value.find((m) => m.id === exercise?.machine_id)
  // Limit exercises
  exerciseService.get({ machine_id: exercise?.machine_id }).then((res) => (exercises.value = res))
  instructionService.get({ exercise_id: exercise?.id }).then((res) => (instructions.value = res))
  selectedInstructionCard.value = undefined
}

function handleMachinesCardSelect(card: Card) {
  panelsShow.value = ["Exercises"]

  exerciseService.get({ machine_id: card.id }).then((res) => (exercises.value = res))
  selectedExerciseCard.value = undefined
  selectedInstructionCard.value = undefined
  instructions.value = []
}

const { isAdmin, isTrainer } = useUser()
const {
  entities: machines,
  cards: machineCards,
  activeEntity: activeMachine,
  isEntityDetailActive: isMachineDetailActive,
  handleEntityCreation: handleMachineCreation,
  handleEntitySelect: handleMachineSelect,
  handleEntityApiCreation: handleMachineApiCreation,
  handleDelete: handleMachineDeletion,
  fetchAllEntities: fetchAllMachines,
} = useDetail(searchData, machineService, isMachineSearched, machineToCard)

const {
  entities: exercises,
  cards: exerciseCards,
  activeEntity: activeExercise,
  isEntityDetailActive: isExerciseDetailActive,
  handleEntityCreation: handleExerciseCreation,
  handleEntitySelect: handleExerciseSelect,
  handleEntityApiCreation: handleExerciseApiCreation,
  handleDelete: handleExerciseDeletion,
  fetchAllEntities: fetchAllExercises,
} = useDetail(searchData, exerciseService, isExerciseSearched, exerciseToCard)

const {
  entities: instructions,
  cards: instructionCards,
  activeEntity: activeInstruction,
  isEntityDetailActive: isInstructionDetailActive,
  handleEntityCreation: handleInstructionCreation,
  handleEntitySelect: handleInstructionSelect,
  handleEntityApiCreation: handleInstructionApiCreation,
} = useDetail(searchData, instructionService, isInstructionSearched, instructionToCard)

onMounted(() => {
  fetchAllExercises()
  fetchAllMachines().then(() => {
    if (!props.id) return

    const propMachineCard = machineCards.value.find((m) => m.id === Number(props.id))
    if (!propMachineCard) return

    selectedMachineCard.value = propMachineCard
    handleMachinesCardSelect(propMachineCard)
  })
})

function handleMachineUnselect() {
  handleExerciseUnselect()
  fetchAllExercises()
  selectedExerciseCard.value = undefined
}

function handleExerciseUnselect() {
  selectedInstructionCard.value = undefined
  instructions.value = []
}

function handleInstructionUnselect() {
  panelsShow.value = ["Instructions"]
  instructions.value = instructions.value.filter((i) => i.id !== selectedInstructionCard.value?.id)
  selectedInstructionCard.value = undefined
}

function cascadeMachineDeletion(machine: Machine) {
  handleMachineDeletion(machine.id)
  const exerciseIds = exercises.value.filter((e) => e.machine_id === machine.id).map((e) => e.id)

  exercises.value = exercises.value.filter((e) => e.machine_id !== machine.id)
  instructions.value = instructions.value.filter((i) => !exerciseIds.includes(i.exercise_id))
}

function cascadeExerciseDeletion(exercise: Exercise) {
  handleExerciseDeletion(exercise.id)

  instructions.value = instructions.value.filter((i) => i.exercise_id !== exercise.id)
}
</script>

<template>
  <div>
    <MachineDetail
      v-model:active="isMachineDetailActive"
      v-model:machine="activeMachine"
      @create:machine="handleMachineApiCreation"
    />

    <ExerciseDetail
      v-model:active="isExerciseDetailActive"
      v-model:exercise="activeExercise"
      @create:exercise="handleExerciseApiCreation"
      :machine-id="selectedMachineCard?.id"
    />

    <InstructionDetail
      v-model:active="isInstructionDetailActive"
      v-model:instruction="activeInstruction"
      @create:instruction="handleInstructionApiCreation"
      :exercise-id="selectedExerciseCard?.id"
      :user-id="userId"
    />

    <v-container fluid>
      <v-text-field
        prepend-icon="mdi-magnify"
        v-model="searchData.text"
        class="mt-2 mx-2"
        label="Search"
        placeholder="Search name or muscle groups..."
        variant="outlined"
        clearable
        hide-details="auto"
      />
      <div class="d-flex pa-2">
        <v-chip-group v-model="searchData.difficulties" filter multiple>
          <v-chip
            variant="outlined"
            v-for="difficulty in Object.values(Difficulty)"
            :key="difficulty"
            :value="difficulty"
            :color="difficultyToColor(difficulty)"
          >
            {{ difficultyToString(difficulty) }}
          </v-chip>
        </v-chip-group>
      </div>
    </v-container>

    <v-expansion-panels v-model="panelsShow" multiple variant="accordion">
      <CardPanel
        name="Machines"
        :can-edit="isAdmin"
        :cards="machineCards"
        v-model="selectedMachineCard"
        @select:card="handleCardSelect"
        @view:card="handleMachineSelect"
        @create:card="handleMachineCreation"
        @unselect:card="handleMachineUnselect"
        @delete:card="cascadeMachineDeletion"
      >
        <template #deletionWarning>
          <div class="text-start mt-2">
            <p>The following will be permanently deleted:</p>

            <v-list density="compact" bg-color="transparent">
              <v-list-item prepend-icon="mdi-circle-small" class="pa-0">
                <v-list-item-title>The machine</v-list-item-title>
              </v-list-item>
              <v-list-item prepend-icon="mdi-circle-small" class="pa-0">
                <v-list-item-title>All of its associated exercises</v-list-item-title>
              </v-list-item>
              <v-list-item prepend-icon="mdi-circle-small" class="pa-0">
                <v-list-item-title>All of the exercises' associated instructions</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </template>
      </CardPanel>

      <CardPanel
        name="Exercises"
        :can-edit="isAdmin"
        :cards="exerciseCards"
        v-model="selectedExerciseCard"
        @select:card="handleCardSelect"
        @view:card="handleExerciseSelect"
        @create:card="handleExerciseCreation"
        @unselect:card="handleExerciseUnselect"
        @delete:card="cascadeExerciseDeletion"
      >
        <template #deletionWarning>
          <div class="text-start mt-2">
            <p>The following will be permanently deleted:</p>

            <v-list density="compact" bg-color="transparent">
              <v-list-item prepend-icon="mdi-circle-small" class="pa-0">
                <v-list-item-title>The exercise</v-list-item-title>
              </v-list-item>
              <v-list-item prepend-icon="mdi-circle-small" class="pa-0">
                <v-list-item-title>All of associated instructions</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </template>
      </CardPanel>

      <CardPanel
        v-if="selectedExerciseCard"
        name="Instructions"
        :can-edit="isTrainer"
        :use-actions="false"
        :cards="instructionCards"
        v-model="selectedInstructionCard"
        @select:card="handleCardSelect"
        @view:card="handleInstructionSelect"
        @create:card="handleInstructionCreation"
      />
    </v-expansion-panels>

    <InstructionView
      v-if="selectedInstruction"
      v-model="selectedInstruction"
      @delete:instruction="handleInstructionUnselect"
    />
  </div>
</template>
