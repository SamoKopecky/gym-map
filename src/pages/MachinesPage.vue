<script setup lang="ts">
import { type Machine } from "@/types/machine"
import { ref } from "vue"
import CardPanel from "@/components/CardPanel.vue"
import NewMachine from "@/components/NewMachine.vue"
import { machineService } from "@/services/machine"
import { onMounted } from "vue"

const machines = ref<Machine[]>([])
const searchBar = ref<string>()
const panelsShow = ref<string[]>([])
const newMachineActive = ref<boolean>(false)

function handleCardSelect(panelName: string) {
  // Remove machines from selected expansion panels to hide it
  panelsShow.value = panelsShow.value?.filter((p) => p !== panelName)
}

onMounted(() => fetchMachines())

function fetchMachines() {
  machineService.get().then((res) => {
    machines.value = res
  })
}
</script>

<template>
  <NewMachine v-model="newMachineActive" @create:machine="fetchMachines" />

  <v-text-field
    v-model="searchBar"
    class="mt-2 mx-2"
    label="Search"
    placeholder="Search anything..."
    variant="outlined"
  ></v-text-field>
  <v-expansion-panels v-model="panelsShow" multiple>
    <CardPanel
      v-model:card-dialog="newMachineActive"
      v-model:cards="machines"
      name="Machines"
      :search-bar="searchBar"
      @select:card="handleCardSelect"
    >
    </CardPanel>
  </v-expansion-panels>
</template>
