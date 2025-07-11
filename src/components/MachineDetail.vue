<script setup lang="ts">
import { useUser } from "@/composables/useUser"
import { machineService } from "@/services/machine"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { type MachineState, type Machine } from "@/types/machine"
import { reactive } from "vue"
import { ref, watch } from "vue"

const MAX_NAME_CHARS = 255

const emit = defineEmits(["create:machine"])

const active = defineModel<boolean>("active", { required: true })
const machine = defineModel<Machine>("machine", { required: false })
const isLoading = ref(false)
const isFormValid = ref(false)

const { addNotification } = useNotificationStore()
const { isAdmin } = useUser()

const formData = reactive<MachineState>({
  name: "",
  description: "",
  muscle_groups: [],
})

const nameRules = [
  (value: string) => !!value || "Machine name is required.",
  (value: string) =>
    (value && value.length <= MAX_NAME_CHARS) ||
    `Name must be less than ${MAX_NAME_CHARS} characters.`,
]

watch(active, (newVal) => {
  if (machine.value && newVal) {
    formData.name = machine.value.name
    formData.description = machine.value.description ?? ""
    formData.muscle_groups = machine.value.muscle_groups ?? []
  } else {
    formData.name = ""
    formData.description = ""
    formData.muscle_groups = []
  }
})

function saveMachine() {
  // TODO: User feedback on fail
  if (!isFormValid.value) return

  isLoading.value = true
  if (!machine.value) {
    machineService
      .post({ ...formData })
      .then((res) => {
        emit("create:machine", res)
        active.value = false
        addNotification("Machine succesfully saved", "success")
      })
      .finally(() => {
        isLoading.value = false
      })
      .catch(() => {
        addNotification("Machine failed to save", "error")
      })
  } else {
    machineService
      .patch({
        id: machine.value.id,
        ...formData,
      })
      .then(() => {
        Object.assign(machine.value!, formData)
        active.value = false
        addNotification("Machine edited", "success")
      })
      .finally(() => {
        isLoading.value = false
      })
      .catch(() => {
        addNotification("Machine failed to save", "error")
      })
  }
}
</script>

<template>
  <v-dialog v-model="active" max-width="800px">
    <v-card>
      <v-card-title class="pa-4">
        <span class="text-h5">Add New Machine</span>
      </v-card-title>

      <v-divider />

      <v-form v-model="isFormValid" @submit.prevent="saveMachine">
        <v-card-text class="pt-4">
          <v-text-field
            :readonly="!isAdmin"
            v-model="formData.name"
            label="Machine name"
            variant="outlined"
            :rules="nameRules"
            :counter="MAX_NAME_CHARS"
            prepend-inner-icon="mdi-dumbbell"
            class="mb-2"
          />

          <v-textarea
            :readonly="!isAdmin"
            v-model="formData.description"
            label="Machine description"
            variant="outlined"
            rows="3"
            auto-grow
            prepend-inner-icon="mdi-note-text-outline"
            class="mb-2"
          />

          <v-combobox
            :readonly="!isAdmin"
            v-model="formData.muscle_groups"
            label="Muscle groups"
            chips
            multiple
            variant="outlined"
            prepend-inner-icon="mdi-weight-lifter"
            :hint="isAdmin ? 'Type and press Enter to add a new muscle group' : undefined"
            persistent-hint
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-btn variant="text" @click="active = false"> Cancel </v-btn>
          <v-spacer />
          <v-btn
            v-if="isAdmin"
            color="green"
            variant="flat"
            type="submit"
            :disabled="!isFormValid"
            :loading="isLoading"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
