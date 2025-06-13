<script setup lang="ts">
import { type CardPanelName, type Machine } from "@/types/machine"
import { ref } from "vue"
import CardPanel from "@/components/CardPanel.vue"
import MachineDetail from "@/components/MachineDetail.vue"
import { onMounted } from "vue"
import { machineToCard } from "@/utils/transformators"
import { isMachineSearched } from "@/utils/search"
import { useDetail } from "@/composables/useDetail"
import { machineService } from "@/services/machine"

const searchBar = ref<string>()
const panelsShow = ref<CardPanelName[]>(["Machines"])
const isAdmin = ref(false)

function handleCardSelect(panelName: string) {
  // Remove machines from selected expansion panels to hide it
  panelsShow.value = panelsShow.value?.filter((p) => p !== panelName)
}

const {
  cards: machineCards,
  activeEntity: activeMachine,
  isEntityDetailActive: isMachineDetailActive,
  handleEntityCreation: handleMachineCreation,
  handleEntitySelect: handleMachineSelect,
  fetchEntities: fetchMachines,
} = useDetail<Machine>(searchBar, machineService, isMachineSearched, machineToCard)

onMounted(() => fetchMachines())
</script>

<template>
  <MachineDetail
    v-model:active="isMachineDetailActive"
    v-model:machine="activeMachine"
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
      name="Machines"
      :cards="machineCards"
      :is-admin="isAdmin"
      @select:card="handleCardSelect"
      @view:card="handleMachineSelect"
      @create:card="handleMachineCreation"
    />

    <CardPanel
      name="Exercises"
      :cards="machineCards"
      :is-admin="isAdmin"
      @select:card="handleCardSelect"
      @view:card="handleMachineSelect"
      @create:card="handleMachineCreation"
    />
  </v-expansion-panels>
</template>
