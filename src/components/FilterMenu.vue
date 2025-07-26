<script setup lang="ts">
import { categoryService } from "@/services/category"
import { type CategoryProperties } from "@/types/category"
import type { Property } from "@/types/property"
import { onMounted, ref } from "vue"

const activeFilters = defineModel<Property[]>({ required: true, default: [] })

const drawer = ref(false)
const categories = ref<CategoryProperties[]>([])

function resetFilters() {
  activeFilters.value = []
  drawer.value = false
}

onMounted(() => categoryService.get().then((res) => (categories.value = res)))
</script>

<template>
  <div>
    <v-btn icon="mdi-filter-outline" variant="text" @click="drawer = !drawer"> </v-btn>

    <v-navigation-drawer v-model="drawer">
      <v-list>
        <div class="d-flex justify-end pa-2">
          <v-btn
            icon="mdi-refresh"
            variant="text"
            @click="resetFilters"
            v-tooltip:bottom="'Reset filters'"
          />
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="drawer = false"
            v-tooltip:bottom="'Close'"
          />
        </div>

        <v-divider />
        <v-list-group v-for="category in categories" :key="category.id" no-action>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :title="category.name" />
          </template>

          <v-list-item v-for="property in category.properties" :key="property.id" density="compact">
            <v-checkbox
              v-model="activeFilters"
              :label="property.name"
              :value="property"
              hide-details
              density="compact"
            ></v-checkbox>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<style>
.v-list-item .v-checkbox {
  margin-top: -8px;
  margin-bottom: -8px;
}
</style>
