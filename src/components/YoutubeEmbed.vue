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

<template>
  <iframe
    height="100%"
    width="100%"
    class="responsive-iframe"
    :src="`https://www.youtube.com/embed/${props.videoId}?rel=0`"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</template>
