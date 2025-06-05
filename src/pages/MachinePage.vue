<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const numId = computed(() => Number(props.id))
</script>

<template>
  <h1>{{ numId }}</h1>
</template>
