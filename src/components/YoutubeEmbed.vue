<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({
  videoId: {
    type: String,
    required: true,
  },
})

// Compute the embed URL
const embedUrl = computed(() => {
  return `https://www.youtube.com/embed/${props.videoId}?rel=0` // rel=0 prevents related videos from other channels
})

// Compute the aspect ratio padding
</script>

<template></template>
