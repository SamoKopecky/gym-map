<script setup lang="ts">
import { ref } from "vue"
import { difficultyToColor, difficultyToString } from "@/utils/transformators"
import { Difficulty } from "@/types/exercise"
import type { SearchData } from "@/types/other"
import { useI18n } from "vue-i18n"
import type { Property } from "@/types/property"
import FilterMenu from "@/components/FilterMenu.vue"
import SearchHelp from "@/components/SearchHelp.vue"

const searchData = defineModel<SearchData>({ required: true })
const showSearchHelp = ref(false)

const { t } = useI18n()

function removePropertyFilter(property: Property) {
  const index = searchData.value.properties.indexOf(property)
  searchData.value.properties.splice(index, 1)
}
</script>

<template>
  <SearchHelp v-model="showSearchHelp" />

  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="12" md="10" xl="11" sm="12">
        <v-text-field
          prepend-icon="mdi-magnify"
          v-model="searchData.text"
          class="flex-grow-1"
          :label="t('form.search')"
          :placeholder="t('form.searchPlaceholder')"
          variant="outlined"
          clearable
          hide-details="auto"
        />
      </v-col>
      <v-col cols="12" md="2" xl="1" sm="12">
        <div class="d-flex align-center justify-center">
          <FilterMenu v-model="searchData.properties" class="ml-2" />
          <v-btn
            icon="mdi-help-circle-outline"
            variant="text"
            class="ml-2"
            @click="showSearchHelp = true"
            :title="t('searchHelp.title')"
            v-tooltip:bottom="'Help'"
          />
        </div>
      </v-col>
    </v-row>

    <div class="d-flex">
      <v-chip-group v-model="searchData.difficulties" filter multiple>
        <v-chip
          variant="outlined"
          v-for="difficulty in Object.values(Difficulty)"
          :key="difficulty"
          :value="difficulty"
          :color="difficultyToColor(difficulty)"
        >
          {{ t(difficultyToString(difficulty)) }}
        </v-chip>
      </v-chip-group>
    </div>

    <div v-if="searchData.properties.length > 0" class="d-flex align-center">
      <transition-group name="chip" tag="div" class="d-flex">
        <v-chip
          v-for="property in searchData.properties"
          :key="property.id"
          variant="outlined"
          class="mr-2"
          closable
          @click:close="removePropertyFilter(property)"
        >
          {{ property.name }}
        </v-chip>
      </transition-group>
    </div>
  </v-container>
</template>

<style scoped>
.chip-leave-active {
  transition: all 0.3s ease;
}

.chip-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
