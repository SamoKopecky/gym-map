<script setup lang="ts">
import VueMarkdown from "vue-markdown-render"
import { ref } from "vue"
import changelogText from "../../CHANGELOG.md?raw"
import { version } from "../../package.json"
import { onMounted } from "vue"
import { VERSION_STORAGE_KEY } from "@/constants"

const src = ref(changelogText)

onMounted(() => window.localStorage.setItem(VERSION_STORAGE_KEY, version))
</script>

<template>
  <h1 class="main-title">Current version {{ version }}</h1>
  <div class="changelog-container">
    <VueMarkdown :source="src"></VueMarkdown>
  </div>
</template>

<style scoped>
.main-title {
  font-size: 2rem; /* Make it bigger */
  font-weight: 700; /* Make it bolder */
  color: #2c3e50; /* A dark, strong color */
  text-align: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eaecef; /* A light gray separating line */
}

.changelog-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.7;
  color: #2c3e50;

  /* Centering and Padding */
  max-width: 800px; /* Adjust the max-width as needed */
  margin: 0 auto; /* Keeps the block centered on larger screens */
  padding: 1rem 2rem; /* Adds space on top/bottom and L/R edges */
}

/* Style for the version number (e.g., # Version 0.1.0) */
.changelog-container :deep(h1) {
  font-size: 2rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #eaecef;
}

/* Style for section titles using Vuetify's primary color */
.changelog-container :deep(h2) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1976d2; /* Vuetify Primary Blue */
}

/* Style for the list of changes */
.changelog-container :deep(ul) {
  list-style: none;
  padding-left: 1.5rem;
}

/* Style for each change item */
.changelog-container :deep(li) {
  margin-bottom: 0.5rem;
  position: relative;
}

/* Custom bullet using Vuetify's primary color */
.changelog-container :deep(li::before) {
  content: "•";
  color: #1976d2; /* Vuetify Primary Blue */
  font-weight: bold;
  display: inline-block;
  position: absolute;
  left: -1.2rem;
  font-size: 1.2rem;
  line-height: 1;
}

/* Style for any inline code */
.changelog-container :deep(code) {
  background-color: #f1f1f1;
  padding: 0.2em 0.4em;
  border-radius: 6px;
  font-size: 85%;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}
</style>
