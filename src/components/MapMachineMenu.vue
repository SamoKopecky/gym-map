<script setup lang="ts">
import type { Machine } from "@/types/machine"
import { pushToMachinesPage } from "@/utils/router"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

const active = defineModel<boolean>("active", { required: true })
const machine = defineModel<Machine>("machine", { required: true })

const router = useRouter()
const { t } = useI18n()
</script>

<template>
  <div>
    <v-card min-width="200">
      <v-card-title>
        <div class="d-flex align-center justify-space-between">
          <p>{{ machine.name }}</p>
          <v-btn
            @click="active = false"
            class="ml-4"
            color="error"
            variant="text"
            icon="mdi-close"
          ></v-btn>
        </div>
      </v-card-title>
      <v-card-subtitle> {{ machine.muscle_groups?.join(", ") }} </v-card-subtitle>
      <v-card-text>
        <v-btn @click="pushToMachinesPage(router, machine.id)">{{
          t("navigation.moreDetails")
        }}</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>
