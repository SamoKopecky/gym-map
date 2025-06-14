<script setup lang="ts">
import type { Machine } from "@/types/machine"
import { pushToMachinesPage } from "@/utils/router"
import { getMachineHtmlId } from "@/utils/transformators"
import { ref } from "vue"
import { useRouter } from "vue-router"

const active = defineModel<boolean>("active", { required: true })
const machine = defineModel<Machine>("machine", { required: true })
const isAdmin = ref<boolean>(false)

const router = useRouter()
</script>

<template>
  <div>
    <v-menu
      v-model="active"
      :activator="getMachineHtmlId(machine)"
      :close-on-content-click="false"
      offset="10"
      :open-on-click="false"
      location="left"
      persistent
    >
      <v-card min-width="150" max-width="300">
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
          <v-checkbox label="Admin view" v-model="isAdmin" />
          <v-btn @click="pushToMachinesPage(router, machine.id)">More details</v-btn>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>
