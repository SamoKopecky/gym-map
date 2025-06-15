<script setup lang="ts">
import { type Card, type CardPanelName } from "@/types/card"
import { ref } from "vue"
import CardPanel from "@/components/CardPanel.vue"
import MachineDetail from "@/components/MachineDetail.vue"
import { onMounted } from "vue"
import { exerciseToCard, machineToCard, difficultyToColor } from "@/utils/transformators"
import { isExerciseSearched, isMachineSearched } from "@/utils/search"
import { useDetail } from "@/composables/useDetail"
import { machineService } from "@/services/machine"
import { exerciseService } from "@/services/exercise"
import ExerciseDetail from "@/components/ExerciseDetail.vue"
import { Difficulty } from "@/types/exercise"
import { reactive } from "vue"
import { type SearchData } from "@/types/other"

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
const isAdmin = ref(false)
const selectedMachineCard = ref<Card>()
const selectedExerciseCard = ref<Card>()

function handleCardSelect(card: Card, panelName: CardPanelName) {
  if (panelName === "Machines") {
    handleMachinesCardSelect(card)
  } else if (panelName === "Exercises") {
    handleExerciseCardSelect(card)
  }
}

function handleExerciseCardSelect(card: Card) {
  // TODO: Select trainer cards
  panelsShow.value = []

  const exercise = exercises.value.find((m) => m.id === card.id)
  if (!exercise) return
  // Select machine
  selectedMachineCard.value = machines.value.find((m) => m.id === exercise?.machine_id)
  // Limit exercises
  exerciseService.get({ machine_id: exercise?.machine_id }).then((res) => (exercises.value = res))
}

function handleMachinesCardSelect(card: Card) {
  selectedMachineCard.value = card
  exerciseService.get({ machine_id: card.id }).then((res) => (exercises.value = res))
  panelsShow.value = ["Exercises"]
}

const {
  entities: machines,
  cards: machineCards,
  activeEntity: activeMachine,
  isEntityDetailActive: isMachineDetailActive,
  handleEntityCreation: handleMachineCreation,
  handleEntitySelect: handleMachineSelect,
  handleEntityApiCreation: handleMachineApiCreation,
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
  fetchAllEntities: fetchAllExercises,
} = useDetail(searchData, exerciseService, isExerciseSearched, exerciseToCard)

onMounted(() => {
  fetchAllExercises()
  fetchAllMachines().then(() => {
    if (!props.id) return

    const propMachineCard = machineCards.value.find((m) => m.id === Number(props.id))
    if (!propMachineCard) return

    handleMachinesCardSelect(propMachineCard)
  })
})

function handleMachineUnselect() {
  fetchAllExercises()
  selectedExerciseCard.value = undefined
}
</script>

<template>
  <div>
    <MachineDetail
      v-model:active="isMachineDetailActive"
      v-model:machine="activeMachine"
      @create:machine="handleMachineApiCreation"
      :is-read-only="!isAdmin"
    />

    <ExerciseDetail
      v-model:active="isExerciseDetailActive"
      v-model:exercise="activeExercise"
      @create:exercise="handleExerciseApiCreation"
      :is-read-only="!isAdmin"
      :machine-id="selectedMachineCard?.id"
    />

    <v-container fluid>
      <v-checkbox label="Admin view" v-model="isAdmin" hide-details="auto" />
      <v-text-field
        v-model="searchData.text"
        class="mt-2 mx-2"
        label="Search"
        placeholder="Search anything..."
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
            {{ difficulty }}
          </v-chip>
        </v-chip-group>
      </div>
    </v-container>

    <v-expansion-panels v-model="panelsShow" multiple variant="accordion">
      <CardPanel
        name="Machines"
        :cards="machineCards"
        :is-admin="isAdmin"
        v-model="selectedMachineCard"
        @select:card="handleCardSelect"
        @view:card="handleMachineSelect"
        @create:card="handleMachineCreation"
        @unselect:card="handleMachineUnselect"
      />

      <CardPanel
        name="Exercises"
        :cards="exerciseCards"
        :is-admin="isAdmin"
        v-model="selectedExerciseCard"
        @select:card="handleCardSelect"
        @view:card="handleExerciseSelect"
        @create:card="handleExerciseCreation"
      />
    </v-expansion-panels>
  </div>
</template>
