<script setup lang="ts">
import { type Machine } from "@/types/machine"
import { ref } from "vue"
import CardPanel from "@/components/CardPanel.vue"
import MachineDetail from "@/components/MachineDetail.vue"
import { machineService } from "@/services/machine"
import { onMounted } from "vue"

const machines = ref<Machine[]>([])
const searchBar = ref<string>()
const panelsShow = ref<string[]>(["Machines"])
const isMachineDetailaActive = ref<boolean>(false)
const activeMachineDetail = ref<Machine>()
const isAdmin = ref(false)

function handleCardSelect(panelName: string) {
  // Remove machines from selected expansion panels to hide it
  panelsShow.value = panelsShow.value?.filter((p) => p !== panelName)
}

function handleMachineSelect(machine: Machine) {
  activeMachineDetail.value = machine
  isMachineDetailaActive.value = true
}

function handleMachineCreation() {
  activeMachineDetail.value = undefined
  isMachineDetailaActive.value = true
}

onMounted(() => fetchMachines())

function fetchMachines() {
  machineService.get().then((res) => {
    machines.value = res
  })
}
</script>

<template>
  <MachineDetail
    v-model:active="isMachineDetailaActive"
    v-model:machine="activeMachineDetail"
    @create:machine="fetchMachines"
    :is-read-only="!isAdmin"
  />

  <v-checkbox label="Admin view" v-model="isAdmin" />
  <v-text-field
    v-model="searchBar"
    class="mt-2 mx-2"
    label="Search"
    placeholder="Search anything..."
    variant="outlined"
    clearable
  />
  <v-expansion-panels v-model="panelsShow" multiple>
    <CardPanel
      v-model="machines"
      name="Machines"
      :search-bar="searchBar"
      :is-admin="isAdmin"
      @select:card="handleCardSelect"
      @view:card="handleMachineSelect"
      @create:card="handleMachineCreation"
    >
    </CardPanel>
  </v-expansion-panels>
</template>
