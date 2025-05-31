<script setup lang="ts">
import type { ChoiseItem } from "@/types/machine"
import { watch } from "vue"
import { computed } from "vue"
import { ref } from "vue"

defineProps({
  appendIcon: {
    type: String,
    required: false,
    default: undefined,
  },
})

const items = defineModel<ChoiseItem[]>({ required: true })

const emit = defineEmits(["set:item"])

const selectedItems = ref<ChoiseItem[]>([])
const activeItems = ref<ChoiseItem[]>(items.value)

const selectedItem = computed(() =>
  selectedItems.value.length === 1 ? selectedItems.value[0] : undefined,
)

watch(selectedItem, (newItem: ChoiseItem | undefined) => {
  if (!newItem) {
    clearExercises()
    return
  }
  activeItems.value = items.value.filter((i) => i.id === newItem.id)
  emit("set:item", newItem.id)
})

const clearExercises = () => {
  emit("set:item", undefined)
  activeItems.value = items.value
}
</script>

<template>
  <v-list density="compact" v-model:selected="selectedItems" select-strategy="single-independent">
    <TransitionGroup name="list">
      <v-list-item v-for="item in activeItems" :key="item.id" :value="item">
        <template #title>{{ item.name }} </template>
        <template #subtitle> {{ item.subtitle }}</template>
        <template #prepend v-if="item.id === selectedItem?.id">
          <v-btn @click="clearExercises" icon="mdi-close" size="small" color="red" variant="text" />
        </template>
        <template #append v-if="item.append && appendIcon">
          <v-icon class="mr-2">{{ appendIcon }}</v-icon>
          <p>{{ item.append }}</p>
        </template>
      </v-list-item>
    </TransitionGroup>
  </v-list>
</template>

<style lang="css" scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
