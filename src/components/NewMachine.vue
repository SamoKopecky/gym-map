<script setup lang="ts">
const active = defineModel<boolean>({ required: true })
</script>

<template>
  <v-dialog v-model="active" title="Create new">
    <v-card title="Add new machine">
      <v-card-text>
        <v-label>Machine name</v-label>
        <v-text-field variant="outlined"> </v-text-field>

        <v-label>Machine description</v-label>
        <v-textarea variant="outlined"> </v-textarea>

        <v-label>Muscle groups</v-label>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
