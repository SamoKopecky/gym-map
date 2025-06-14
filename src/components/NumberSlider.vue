<script setup lang="ts">
defineProps({
  max: {
    type: Number,
    required: true,
  },
  step: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
})

const valueNum = defineModel<number>({ required: true })
</script>

<template>
  <v-slider v-model="valueNum" :label="label" :max="max" :step="step">
    <template #append>
      <v-number-input
        :step="step"
        v-model="valueNum"
        density="compact"
        type="number"
        control-variant="stacked"
        variant="outlined"
        hide-details
      />
    </template>
  </v-slider>
</template>
