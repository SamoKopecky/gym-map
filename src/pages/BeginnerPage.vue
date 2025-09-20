<script setup lang="ts">
import { ref } from "vue"
import { useDisplay } from "vuetify"

const currentSlide = ref(0)
// eslint-disable-next-line
const selectedExercise = ref<any>(null)
const { xs, mdAndUp } = useDisplay()

const legExercises = [
  {
    id: 1,
    name: "Squats",
    description: "The king of leg exercises",
    instructions:
      "Stand with feet shoulder-width apart, lower body as if sitting back into a chair, keep chest up and knees behind toes, return to standing",
    difficulty: "Beginner",
  },
  {
    id: 2,
    name: "Leg Press",
    description: "Machine-based leg strengthening",
    instructions:
      "Sit on leg press machine, place feet shoulder-width apart on platform, lower weight by bending knees to 90 degrees, push back up",
    difficulty: "Beginner",
  },
  {
    id: 3,
    name: "Hack Squat Machine",
    description: "Guided squat movement",
    instructions:
      "Position yourself on hack squat machine, feet shoulder-width apart, lower by bending knees while keeping back against pad, push up through heels",
    difficulty: "Beginner",
  },
]

const chestExercises = [
  {
    id: 4,
    name: "Bench Press",
    description: "Classic chest building exercise",
    instructions:
      "Lie on bench, grip barbell slightly wider than shoulders, lower to chest, press up until arms are extended",
    difficulty: "Beginner",
  },
  {
    id: 5,
    name: "Chest Press Machine",
    description: "Safe machine-based chest exercise",
    instructions:
      "Sit on chest press machine, grip handles at chest level, push forward until arms are extended, return slowly",
    difficulty: "Beginner",
  },
  {
    id: 6,
    name: "Incline Dumbbell Press",
    description: "Upper chest development",
    instructions:
      "Lie on inclined bench, hold dumbbells at chest level, press up and slightly inward, lower slowly to starting position",
    difficulty: "Beginner",
  },
]

const currentExerciseSet = ref(legExercises)
const currentSetName = ref("Leg")

function nextSlide() {
  if (currentSlide.value === 0) {
    currentSlide.value = 1
  } else if (currentSlide.value === 1 && selectedExercise.value) {
    currentSlide.value = 2
  } else if (currentSlide.value === 2) {
    currentSlide.value = 3 // Go to encouragement slide
  } else if (currentSlide.value === 3) {
    // Switch to chest exercises
    currentExerciseSet.value = chestExercises
    currentSetName.value = "Chest"
    selectedExercise.value = null
    currentSlide.value = 4 // Chest exercise selection
  } else if (currentSlide.value === 4 && selectedExercise.value) {
    currentSlide.value = 5 // Chest instruction slide
  } else if (currentSlide.value === 5) {
    currentSlide.value = 6 // Final congratulations slide
  }
}

function previousSlide() {
  if (currentSlide.value > 0) {
    currentSlide.value--
    if (currentSlide.value === 0) {
      selectedExercise.value = null
    } else if (currentSlide.value === 3) {
      // Going back to leg instructions
      currentSlide.value = 2
    } else if (currentSlide.value === 1 && currentSetName.value === "Chest") {
      // Going back from chest to encouragement slide
      currentSlide.value = 3
      currentExerciseSet.value = legExercises
      currentSetName.value = "Leg"
    }
  }
}

function selectExercise(exercise) {
  selectedExercise.value = exercise
  nextSlide()
}

function resetSlideshow() {
  currentSlide.value = 0
  selectedExercise.value = null
  currentExerciseSet.value = legExercises
  currentSetName.value = "Leg"
}

function goToMap() {
  // Placeholder for navigation to gym map
  // This would typically use router.push('/map') or similar
  alert("This would redirect to the gym map to find this equipment!")
}
</script>

<template>
  <div class="fullscreen-slideshow">
    <!-- Slide Counter - Fixed Position -->
    <div class="slide-counter">
      <v-progress-linear
        :model-value="((currentSlide + 1) / 7) * 100"
        height="4"
        color="primary"
        class="mb-2"
      />
      <v-chip size="small" variant="outlined"> {{ currentSlide + 1 }} / 7 </v-chip>
    </div>

    <v-window v-model="currentSlide" class="slide-window">
      <!-- Intro Slide -->
      <v-window-item :value="0" class="slide-content">
        <div
          class="d-flex flex-column justify-center align-center text-center"
          style="min-height: 100%"
        >
          <v-icon :size="140" color="primary" class="mb-8">mdi-dumbbell</v-icon>
          <h1 class="text-md-h1 text-sm-h3 mb-6 font-weight-bold">Welcome to Gym Basics!</h1>
          <p class="text-md-h5 text-sm-h6 mb-8 text-medium-emphasis max-width-700">
            Learn the fundamental exercises to start your fitness journey. We'll guide you through
            each exercise step by step.
          </p>
          <div class="text-md-h6 text-sm-body-1 mb-10 text-medium-emphasis max-width-600">
            <p class="mb-4">💧 Grab a water bottle to stay hydrated</p>
            <p class="mb-4">🏃‍♂️ Warm up with 5-10 minutes on the treadmill</p>
            <p class="mb-4">🧻 Don't forget a towel for wiping down equipment</p>
          </div>
          <v-btn
            :size="xs ? 'large' : 'x-large'"
            color="primary"
            variant="flat"
            @click="nextSlide"
            :class="xs ? 'px-6 py-3' : 'px-12 py-4'"
          >
            <v-icon start>mdi-play</v-icon>
            Get Started
          </v-btn>
        </div>
      </v-window-item>

      <!-- Exercise Choice Slide -->
      <v-window-item :value="1" class="slide-content">
        <div class="d-flex flex-column" style="min-height: 100%">
          <div class="text-center mb-10">
            <h2 class="text-md-h2 text-sm-h4 mb-6">
              Choose Your First {{ currentSetName }} Exercise
            </h2>
            <p class="text-md-h5 text-sm-h6 text-medium-emphasis">
              Select one of these beginner-friendly {{ currentSetName.toLowerCase() }} exercises to
              learn
            </p>
          </div>

          <div class="flex-grow-1">
            <v-container>
              <v-row justify="center">
                <v-col
                  v-for="exercise in currentExerciseSet"
                  :key="exercise.id"
                  cols="12"
                  md="4"
                  class="d-flex"
                >
                  <v-card
                    hover
                    class="flex-grow-1 cursor-pointer exercise-card"
                    variant="outlined"
                    @click="selectExercise(exercise)"
                  >
                    <v-card-title class="d-flex align-center pa-6">
                      <v-chip class="mr-3" size="small" variant="tonal" color="success">
                        <v-icon start>mdi-weight-lifter</v-icon>
                        {{ exercise.difficulty }}
                      </v-chip>
                      <span class="text-md-h5 text-sm-h6">{{ exercise.name }}</span>
                    </v-card-title>

                    <v-card-text class="pa-6">
                      <div class="text-md-h6 text-sm-body-1 mb-6">
                        {{ exercise.description }}
                      </div>
                      <v-btn variant="tonal" color="primary" block :size="xs ? 'large' : 'x-large'">
                        <v-icon start>mdi-play-circle</v-icon>
                        Learn This Exercise
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>
      </v-window-item>

      <!-- Exercise Instructions Slide -->
      <v-window-item :value="2" class="slide-content">
        <div style="min-height: 100%" v-if="selectedExercise">
          <v-container style="min-height: 100%">
            <v-row
              style="min-height: 100%"
              class="align-center instruction-slide-row"
              :class="mdAndUp ? 'align-center' : 'align-start'"
            >
              <v-col cols="12" md="6" :class="mdAndUp ? 'd-flex align-center' : ''">
                <div class="text-center text-md-left">
                  <v-chip
                    class="mb-6"
                    variant="tonal"
                    color="success"
                    :size="xs ? 'default' : 'large'"
                  >
                    <v-icon start>mdi-weight-lifter</v-icon>
                    {{ selectedExercise.difficulty }}
                  </v-chip>
                  <h2 class="text-md-h1 text-sm-h3 mb-6">{{ selectedExercise.name }}</h2>
                  <p class="text-md-h5 text-sm-h6 mb-8 text-medium-emphasis">
                    {{ selectedExercise.description }}
                  </p>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-8 instruction-card mb-6">
                  <v-card-title class="d-flex align-center mb-6 text-md-h4 text-sm-h5">
                    <v-icon start color="primary" size="large">mdi-information-outline</v-icon>
                    Instructions
                  </v-card-title>
                  <v-card-text class="pa-0">
                    <p class="text-md-h6 text-sm-body-1 mb-6">
                      {{ selectedExercise.instructions }}
                    </p>
                  </v-card-text>
                </v-card>

                <!-- Video Placeholder -->
                <v-card variant="outlined" class="mb-6 video-placeholder">
                  <v-card-text class="pa-8 text-center">
                    <v-icon size="60" color="primary" class="mb-4">mdi-play-circle-outline</v-icon>
                    <h3 class="text-md-h5 text-sm-h6 mb-4">Video Tutorial</h3>
                    <p class="text-md-body-1 text-sm-body-2 text-medium-emphasis mb-6">
                      Watch a demonstration of proper form and technique
                    </p>
                    <v-btn
                      color="primary"
                      variant="outlined"
                      :size="xs ? 'default' : 'large'"
                      disabled
                    >
                      <v-icon start>mdi-video</v-icon>
                      Coming Soon
                    </v-btn>
                  </v-card-text>
                </v-card>

                <!-- Map Redirect Button -->
                <v-card variant="outlined" class="map-redirect-card">
                  <v-card-text class="pa-8 text-center">
                    <v-icon size="60" color="success" class="mb-4">mdi-map-marker</v-icon>
                    <h3 class="text-md-h5 text-sm-h6 mb-4">Find This Equipment</h3>
                    <p class="text-md-body-1 text-sm-body-2 text-medium-emphasis mb-6">
                      Locate this exercise equipment in your gym
                    </p>
                    <v-btn
                      color="success"
                      variant="flat"
                      :size="xs ? 'default' : 'large'"
                      @click="goToMap"
                    >
                      <v-icon start>mdi-map</v-icon>
                      View on Gym Map
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-window-item>

      <!-- Encouragement Slide -->
      <v-window-item :value="3" class="slide-content">
        <div
          class="d-flex flex-column justify-center align-center text-center"
          style="min-height: 100%"
        >
          <v-icon size="140" color="success" class="mb-8">mdi-trophy</v-icon>
          <h1 class="text-md-h1 text-sm-h3 mb-6 font-weight-bold">Great Job!</h1>
          <p class="text-md-h4 text-sm-h5 mb-8 text-medium-emphasis">
            You've completed your first leg exercise! 💪
          </p>
          <p class="text-md-h5 text-sm-h6 mb-10 text-medium-emphasis max-width-700">
            Keep the momentum going! Now let's work on building your chest strength. Remember to
            maintain proper form and breathe steadily.
          </p>
          <v-btn
            :size="xs ? 'large' : 'x-large'"
            color="success"
            variant="flat"
            @click="nextSlide"
            :class="xs ? 'px-6 py-3' : 'px-12 py-4'"
          >
            <v-icon start>mdi-arrow-right</v-icon>
            Continue to Chest Exercises
          </v-btn>
        </div>
      </v-window-item>

      <!-- Chest Exercise Choice Slide -->
      <v-window-item :value="4" class="slide-content">
        <div class="d-flex flex-column" style="min-height: 100%">
          <div class="text-center mb-10">
            <h2 class="text-md-h2 text-sm-h4 mb-6">
              Choose Your First {{ currentSetName }} Exercise
            </h2>
            <p class="text-md-h5 text-sm-h6 text-medium-emphasis">
              Select one of these beginner-friendly {{ currentSetName.toLowerCase() }} exercises to
              learn
            </p>
          </div>

          <div class="flex-grow-1">
            <v-container>
              <v-row justify="center">
                <v-col
                  v-for="exercise in currentExerciseSet"
                  :key="exercise.id"
                  cols="12"
                  md="4"
                  class="d-flex"
                >
                  <v-card
                    hover
                    class="flex-grow-1 cursor-pointer exercise-card"
                    variant="outlined"
                    @click="selectExercise(exercise)"
                  >
                    <v-card-title class="d-flex align-center pa-6">
                      <v-chip class="mr-3" size="small" variant="tonal" color="success">
                        <v-icon start>mdi-weight-lifter</v-icon>
                        {{ exercise.difficulty }}
                      </v-chip>
                      <span class="text-md-h5 text-sm-h6">{{ exercise.name }}</span>
                    </v-card-title>

                    <v-card-text class="pa-6">
                      <div class="text-md-h6 text-sm-body-1 mb-6">
                        {{ exercise.description }}
                      </div>
                      <v-btn variant="tonal" color="primary" block :size="xs ? 'large' : 'x-large'">
                        <v-icon start>mdi-play-circle</v-icon>
                        Learn This Exercise
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </div>
      </v-window-item>

      <!-- Chest Exercise Instructions Slide -->
      <v-window-item :value="5" class="slide-content">
        <div style="min-height: 100%" v-if="selectedExercise">
          <v-container style="min-height: 100%">
            <v-row
              style="min-height: 100%"
              class="align-center instruction-slide-row"
              :class="mdAndUp ? 'align-center' : 'align-start'"
            >
              <v-col cols="12" md="6" :class="mdAndUp ? 'd-flex align-center' : ''">
                <div class="text-center text-md-left">
                  <v-chip
                    class="mb-6"
                    variant="tonal"
                    color="success"
                    :size="xs ? 'default' : 'large'"
                  >
                    <v-icon start>mdi-weight-lifter</v-icon>
                    {{ selectedExercise.difficulty }}
                  </v-chip>
                  <h2 class="text-md-h1 text-sm-h3 mb-6">{{ selectedExercise.name }}</h2>
                  <p class="text-md-h5 text-sm-h6 mb-8 text-medium-emphasis">
                    {{ selectedExercise.description }}
                  </p>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-8 instruction-card mb-6">
                  <v-card-title class="d-flex align-center mb-6 text-md-h4 text-sm-h5">
                    <v-icon start color="primary" size="large">mdi-information-outline</v-icon>
                    Instructions
                  </v-card-title>
                  <v-card-text class="pa-0">
                    <p class="text-md-h6 text-sm-body-1 mb-6">
                      {{ selectedExercise.instructions }}
                    </p>
                  </v-card-text>
                </v-card>

                <!-- Video Placeholder -->
                <v-card variant="outlined" class="mb-6 video-placeholder">
                  <v-card-text class="pa-8 text-center">
                    <v-icon size="60" color="primary" class="mb-4">mdi-play-circle-outline</v-icon>
                    <h3 class="text-md-h5 text-sm-h6 mb-4">Video Tutorial</h3>
                    <p class="text-md-body-1 text-sm-body-2 text-medium-emphasis mb-6">
                      Watch a demonstration of proper form and technique
                    </p>
                    <v-btn
                      color="primary"
                      variant="outlined"
                      :size="xs ? 'default' : 'large'"
                      disabled
                    >
                      <v-icon start>mdi-video</v-icon>
                      Coming Soon
                    </v-btn>
                  </v-card-text>
                </v-card>

                <!-- Map Redirect Button -->
                <v-card variant="outlined" class="map-redirect-card">
                  <v-card-text class="pa-8 text-center">
                    <v-icon size="60" color="success" class="mb-4">mdi-map-marker</v-icon>
                    <h3 class="text-md-h5 text-sm-h6 mb-4">Find This Equipment</h3>
                    <p class="text-md-body-1 text-sm-body-2 text-medium-emphasis mb-6">
                      Locate this exercise equipment in your gym
                    </p>
                    <v-btn
                      color="success"
                      variant="flat"
                      :size="xs ? 'default' : 'large'"
                      @click="goToMap"
                    >
                      <v-icon start>mdi-map</v-icon>
                      View on Gym Map
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-window-item>

      <!-- Final Congratulations Slide -->
      <v-window-item :value="6" class="slide-content">
        <div
          class="d-flex flex-column justify-center align-center text-center"
          style="min-height: 100%"
        >
          <v-icon size="140" color="success" class="mb-8">mdi-trophy-award</v-icon>
          <h1 class="text-md-h1 text-sm-h3 mb-6 font-weight-bold">Congratulations! 🎉</h1>
          <p class="text-md-h4 text-sm-h5 mb-8 text-medium-emphasis">
            You've completed your beginner workout! 💪
          </p>
          <p class="text-md-h5 text-sm-h6 mb-6 text-medium-emphasis max-width-700">
            You've successfully learned fundamental leg and chest exercises. This is just the
            beginning of your fitness journey!
          </p>
          <div class="text-md-h6 text-sm-body-1 mb-10 text-medium-emphasis max-width-600">
            <p class="mb-4">🔥 You've built a solid foundation</p>
            <p class="mb-4">💪 Remember to maintain proper form</p>
            <p class="mb-4">🎯 Consistency is key to success</p>
            <p class="mb-4">📈 Progress comes with time and dedication</p>
          </div>
          <v-btn
            :size="xs ? 'large' : 'x-large'"
            color="primary"
            variant="flat"
            @click="resetSlideshow"
            :class="xs ? 'px-6 py-3' : 'px-12 py-4'"
          >
            <v-icon start>mdi-restart</v-icon>
            Start Over
          </v-btn>
        </div>
      </v-window-item>
    </v-window>

    <!-- Navigation Controls - Fixed Bottom -->
    <div class="navigation-controls">
      <v-btn
        v-if="currentSlide > 0"
        variant="outlined"
        :size="xs ? 'default' : 'large'"
        @click="previousSlide"
        class="mr-4"
      >
        <v-icon start>mdi-arrow-left</v-icon>
        Back
      </v-btn>

      <v-spacer />

      <v-btn
        v-if="currentSlide === 6"
        color="primary"
        variant="flat"
        :size="xs ? 'default' : 'large'"
        @click="resetSlideshow"
      >
        <v-icon start>mdi-restart</v-icon>
        Start Over
      </v-btn>
      <v-btn
        v-else-if="currentSlide === 2 || currentSlide === 5"
        color="success"
        variant="flat"
        :size="xs ? 'default' : 'large'"
        @click="nextSlide"
      >
        <v-icon start>mdi-arrow-right</v-icon>
        Continue
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.fullscreen-slideshow {
  height: calc(100vh - 64px); /* Account for app bar */
  width: 100vw;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

@media (max-width: 768px) {
  .fullscreen-slideshow {
    height: calc(100vh - 56px); /* Smaller app bar on mobile */
  }
}

.slide-counter {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.slide-window {
  height: 100%;
  width: 100%;
  padding-bottom: 80px; /* Space for navigation controls */
  box-sizing: border-box;
}

.slide-content {
  min-height: 100%;
  width: 100%;
  padding: 40px;
  overflow-y: auto;
  overflow-x: hidden;
}

.navigation-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.exercise-card {
  transition: all 0.3s ease;
  height: 100%;
}

.exercise-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.instruction-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.video-placeholder {
  background: rgba(245, 245, 245, 0.95);
  backdrop-filter: blur(10px);
  border: 2px dashed #ccc !important;
}

.map-redirect-card {
  background: rgba(232, 245, 233, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid #4caf50 !important;
}

.cursor-pointer {
  cursor: pointer;
}

.max-width-700 {
  max-width: 700px;
  margin: 0 auto;
}

.max-width-600 {
  max-width: 600px;
  margin: 0 auto;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .slide-window {
    padding-bottom: 70px; /* Space for navigation controls on tablet */
  }

  .slide-content {
    padding: 16px;
    min-height: 100%;
    overflow-y: auto;
  }

  .navigation-controls {
    padding: 0 16px;
    height: 70px;
  }

  .slide-counter {
    top: 10px;
    right: 10px;
    padding: 6px 10px;
  }

  /* Responsive icon sizes */
  .v-icon {
    font-size: min(var(--v-icon-size-default), 8vw) !important;
  }

  /* Specific icon size adjustments */
  .v-icon[style*="font-size: 140"] {
    font-size: min(80px, 20vw) !important;
  }

  .v-icon[style*="font-size: 120"] {
    font-size: min(70px, 18vw) !important;
  }

  .v-icon[style*="font-size: 60"] {
    font-size: min(45px, 12vw) !important;
  }

  /* Adjust margins for mobile */
  .mb-8 {
    margin-bottom: 1.5rem !important;
  }

  .mb-6 {
    margin-bottom: 1rem !important;
  }

  .mb-10 {
    margin-bottom: 2rem !important;
  }

  /* Button adjustments for mobile */
  .v-btn--size-x-large {
    padding: 0 1.5rem !important;
    min-height: 48px !important;
  }

  .v-btn--size-large {
    padding: 0 1.25rem !important;
    min-height: 44px !important;
  }

  /* Card adjustments */
  .exercise-card .v-card-title {
    padding: 1rem !important;
  }

  .exercise-card .v-card-text {
    padding: 1rem !important;
  }

  .instruction-card {
    padding: 1rem !important;
  }

  .video-placeholder .v-card-text,
  .map-redirect-card .v-card-text {
    padding: 1.5rem !important;
  }
}

@media (max-width: 480px) {
  .slide-window {
    padding-bottom: 65px; /* Space for navigation controls on mobile */
  }

  .slide-content {
    padding: 12px;
    min-height: 100%;
    overflow-y: auto;
  }

  .navigation-controls {
    padding: 0 12px;
    height: 65px;
  }

  /* Even smaller icons for very small screens */
  .v-icon[style*="font-size: 140"] {
    font-size: min(60px, 15vw) !important;
  }

  .v-icon[style*="font-size: 120"] {
    font-size: min(55px, 14vw) !important;
  }

  .v-icon[style*="font-size: 60"] {
    font-size: min(40px, 10vw) !important;
  }

  /* Tighter spacing */
  .mb-8 {
    margin-bottom: 1rem !important;
  }

  .mb-6 {
    margin-bottom: 0.75rem !important;
  }

  .mb-10 {
    margin-bottom: 1.5rem !important;
  }

  /* Smaller buttons for very small screens */
  .v-btn--size-x-large {
    padding: 0 1rem !important;
    min-height: 44px !important;
    font-size: 0.9rem !important;
  }

  .v-btn--size-large {
    padding: 0 1rem !important;
    min-height: 40px !important;
    font-size: 0.875rem !important;
  }

  /* Even more compact cards */
  .exercise-card .v-card-title,
  .exercise-card .v-card-text {
    padding: 0.75rem !important;
  }

  .instruction-card {
    padding: 0.75rem !important;
  }

  .video-placeholder .v-card-text,
  .map-redirect-card .v-card-text {
    padding: 1rem !important;
  }

  /* Better text wrapping */
  .max-width-700,
  .max-width-600 {
    max-width: 100% !important;
    padding: 0 0.5rem;
  }

  /* Ensure instruction rows stack properly */
  .instruction-slide-row {
    align-items: flex-start !important;
  }

  /* Improve exercise card layout */
  .exercise-card {
    margin-bottom: 1rem;
  }
}
</style>
