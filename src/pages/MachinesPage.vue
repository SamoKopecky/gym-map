<script setup lang="ts">
import { type Machine } from "@/types/machine"
import { ref } from "vue"
import CardPanel from "@/components/CardPanel.vue"
import MachineDetail from "@/components/MachineDetail.vue"
import { machineService } from "@/services/machine"
import { onMounted } from "vue"

const machines = ref<Machine[]>([])
const searchBar = ref<string>()
const panelsShow = ref<string[]>([])
const isMachineDetailaActive = ref<boolean>(false)
const activeMachineDetail = ref<Machine>()

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
  />

  <v-text-field
    v-model="searchBar"
    class="mt-2 mx-2"
    label="Search"
    placeholder="Search anything..."
    variant="outlined"
    clearable
  ></v-text-field>
  <v-expansion-panels v-model="panelsShow" multiple>
    <CardPanel
      v-model="machines"
      name="Machines"
      :search-bar="searchBar"
      @select:card="handleCardSelect"
      @edit:card="handleMachineSelect"
      @create:card="handleMachineCreation"
    >
    </CardPanel>
  </v-expansion-panels>
</template>
