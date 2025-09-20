<script setup lang="ts">
import { LOCALE_STORAGE_KEY } from "@/constants"
import { useI18n } from "vue-i18n"

const { locale } = useI18n()

const availableLocales = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "sk", name: "Slovenčina", flag: " 🇸🇰" },
  { code: "cs", name: "Čeština", flag: "🇨🇿" },
]

function switchLocale(localeCode: string) {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, localeCode)
  locale.value = localeCode
}
</script>

<template>
  <v-list>
    <v-list-item v-for="loc in availableLocales" :key="loc.code" @click="switchLocale(loc.code)">
      <template #prepend>
        <span class="me-3">{{ loc.flag }}</span>
      </template>
      <v-list-item-title>{{ loc.name }}</v-list-item-title>
      <template #append v-if="locale === loc.code">
        <v-icon>mdi-check</v-icon>
      </template>
    </v-list-item>
  </v-list>
</template>
