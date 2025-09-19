<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const currentSlide = ref(0)
const selectedExercise = ref<any>(null)

const mockExercises = [
  {
    id: 1,
    name: "Push-ups",
    description: "A basic upper body exercise",
    instructions: "Place hands on floor, keep body straight, push up and down",
    difficulty: "Beginner",
  },
  {
    id: 2,
    name: "Squats",
    description: "A fundamental leg exercise",
    instructions:
      "Stand with feet shoulder-width apart, lower body as if sitting, return to standing",
    difficulty: "Beginner",
  },
  {
    id: 3,
    name: "Plank",
    description: "Core strengthening exercise",
    instructions: "Hold body in straight line from head to heels, engage core muscles",
    difficulty: "Beginner",
  },
]

function nextSlide() {
  if (currentSlide.value === 0) {
    currentSlide.value = 1
  } else if (currentSlide.value === 1 && selectedExercise.value) {
    currentSlide.value = 2
  }
}

function previousSlide() {
  if (currentSlide.value > 0) {
    currentSlide.value--
    if (currentSlide.value === 0) {
      selectedExercise.value = null
    }
  }
}

function selectExercise(exercise: any) {
  selectedExercise.value = exercise
  nextSlide()
}

function resetSlideshow() {
  currentSlide.value = 0
  selectedExercise.value = null
}
</script>

<template>
  <v-container fluid class="pa-0 fill-height">
    <v-window v-model="currentSlide" class="fill-height">
      <!-- Intro Slide -->
      <v-window-item :value="0" class="fill-height">
        <v-container class="d-flex flex-column justify-center align-center fill-height text-center">
          <v-icon size="120" color="primary" class="mb-6">mdi-dumbbell</v-icon>
          <h1 class="text-h2 mb-4 font-weight-bold">Welcome to Gym Basics!</h1>
          <p class="text-h5 mb-8 text-medium-emphasis max-width-600">
            Learn the fundamental exercises to start your fitness journey. We'll guide you through
            each exercise step by step.
          </p>
          <v-btn size="x-large" color="primary" variant="flat" @click="nextSlide" class="px-8">
            <v-icon start>mdi-play</v-icon>
            Get Started
          </v-btn>
        </v-container>
      </v-window-item>

      <!-- Exercise Choice Slide -->
      <v-window-item :value="1" class="fill-height">
        <v-container class="fill-height">
          <div class="text-center mb-8">
            <h2 class="text-h3 mb-4">Choose Your First Exercise</h2>
            <p class="text-h6 text-medium-emphasis">
              Select one of these beginner-friendly exercises to learn
            </p>
          </div>

          <v-row justify="center">
            <v-col
              v-for="exercise in mockExercises"
              :key="exercise.id"
              cols="12"
              md="4"
              class="d-flex"
            >
              <v-card
                hover
                class="flex-grow-1 cursor-pointer"
                variant="outlined"
                @click="selectExercise(exercise)"
              >
                <v-card-title class="d-flex align-center">
                  <v-chip class="mr-2" size="small" variant="tonal" color="success">
                    <v-icon start>mdi-weight-lifter</v-icon>
                    {{ exercise.difficulty }}
                  </v-chip>
                  <span>{{ exercise.name }}</span>
                </v-card-title>

                <v-card-text>
                  <div class="text-body-1 mb-4">
                    {{ exercise.description }}
                  </div>
                  <v-btn variant="tonal" color="primary" block size="large">
                    <v-icon start>mdi-play-circle</v-icon>
                    Learn This Exercise
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>

      <!-- Exercise Instructions Slide -->
      <v-window-item :value="2" class="fill-height">
        <v-container class="fill-height" v-if="selectedExercise">
          <v-row class="fill-height">
            <v-col cols="12" md="6" class="d-flex align-center">
              <div>
                <v-chip class="mb-4" variant="tonal" color="success">
                  <v-icon start>mdi-weight-lifter</v-icon>
                  {{ selectedExercise.difficulty }}
                </v-chip>
                <h2 class="text-h3 mb-4">{{ selectedExercise.name }}</h2>
                <p class="text-h6 mb-6 text-medium-emphasis">
                  {{ selectedExercise.description }}
                </p>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <v-card variant="outlined" class="pa-6">
                <v-card-title class="d-flex align-center mb-4">
                  <v-icon start color="primary">mdi-information-outline</v-icon>
                  Instructions
                </v-card-title>
                <v-card-text>
                  <p class="text-body-1">{{ selectedExercise.instructions }}</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>
    </v-window>

    <!-- Navigation Controls -->
    <v-sheet class="pa-4" color="surface-variant">
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <v-btn v-if="currentSlide > 0" variant="outlined" @click="previousSlide">
            <v-icon start>mdi-arrow-left</v-icon>
            Back
          </v-btn>
        </v-col>

        <v-col cols="auto" class="text-center">
          <v-chip variant="outlined"> Slide {{ currentSlide + 1 }} of 3 </v-chip>
        </v-col>

        <v-col cols="auto">
          <v-btn v-if="currentSlide === 2" color="primary" variant="flat" @click="resetSlideshow">
            <v-icon start>mdi-restart</v-icon>
            Start Over
          </v-btn>
        </v-col>
      </v-row>
    </v-sheet>
  </v-container>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.max-width-600 {
  max-width: 600px;
}
</style>
