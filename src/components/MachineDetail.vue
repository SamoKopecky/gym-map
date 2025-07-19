<script setup lang="ts">
import { useUser } from "@/composables/useUser"
import { machineService } from "@/services/machine"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { type MachineState, type Machine } from "@/types/machine"
import { reactive } from "vue"
import { ref, watch } from "vue"
import { useI18n } from "vue-i18n"

const MAX_NAME_CHARS = 255

const emit = defineEmits(["create:machine"])

const active = defineModel<boolean>("active", { required: true })
const machine = defineModel<Machine>("machine", { required: false })
const isLoading = ref(false)
const isFormValid = ref(false)

const { addNotification } = useNotificationStore()
const { isAdmin } = useUser()
const { t } = useI18n()

const formData = reactive<MachineState>({
  name: "",
  description: "",
  muscle_groups: [],
})

const nameRules = [
  (value: string) => !!value || t("validation.machineNameRequired"),
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
        addNotification(t("notification.machineSuccessfullySaved"), "success")
      })
      .finally(() => {
        isLoading.value = false
      })
      .catch(() => {
        addNotification(t("notification.machineFailedToSave"), "error")
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
        addNotification(t("notification.machineEdited"), "success")
      })
      .finally(() => {
        isLoading.value = false
      })
      .catch(() => {
        addNotification(t("notification.machineFailedToSave"), "error")
      })
  }
}
</script>

<template>
  <v-dialog v-model="active" max-width="800px">
    <v-card>
      <v-card-title class="pa-4">
        <span class="text-h5">{{ t("dialog.addNewMachine") }}</span>
      </v-card-title>

      <v-divider />

      <v-form v-model="isFormValid" @submit.prevent="saveMachine">
        <v-card-text class="pt-4">
          <v-text-field
            :readonly="!isAdmin"
            v-model="formData.name"
            :label="t('form.machineName')"
            variant="outlined"
            :rules="nameRules"
            :counter="MAX_NAME_CHARS"
            prepend-inner-icon="mdi-dumbbell"
            class="mb-2"
          />

          <v-textarea
            :readonly="!isAdmin"
            v-model="formData.description"
            :label="t('form.machineDescription')"
            variant="outlined"
            rows="3"
            auto-grow
            prepend-inner-icon="mdi-note-text-outline"
            class="mb-2"
          />

          <v-combobox
            :readonly="!isAdmin"
            v-model="formData.muscle_groups"
            :label="t('form.muscleGroups')"
            chips
            multiple
            variant="outlined"
            prepend-inner-icon="mdi-weight-lifter"
            :hint="isAdmin ? t('form.muscleGroupsHint') : undefined"
            persistent-hint
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-btn variant="text" @click="active = false">{{ t("button.cancel") }}</v-btn>
          <v-spacer />
          <v-btn
            v-if="isAdmin"
            color="green"
            variant="flat"
            type="submit"
            :disabled="!isFormValid"
            :loading="isLoading"
          >
            {{ t("button.save") }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
