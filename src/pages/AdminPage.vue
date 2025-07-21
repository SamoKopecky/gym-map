<script setup lang="ts">
import { userService } from "@/services/user"
import { useNotificationStore } from "@/stores/useNotificationStore"
import type { User } from "@/types/user"
import { computed } from "vue"
import { onMounted } from "vue"
import { ref } from "vue"
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog.vue"
import CategoriesPage from "@/components/CategoriesPage.vue"
import { useI18n } from "vue-i18n"

const users = ref<User[]>([])
const search = ref<string>()
const email = ref<string>()
const tableLoading = ref(false)
const emailLoading = ref(false)
const isFormValid = ref(true)
const confirmDeleteActive = ref(false)
const unregisterUser = ref<User>()

const { addNotification } = useNotificationStore()
const { t } = useI18n()

const unregisterUserName = computed(() => unregisterUser.value?.name ?? unregisterUser.value?.email)

const emailRules = [(value: string) => /.+@.+\..+/.test(value) || t("validation.emailMustBeValid")]

const headers = [
  { key: "name", title: t("form.name") },
  { key: "email", title: t("form.email") },
  { key: "actions", title: t("table.actions") },
]

function addNew() {
  if (!email.value) return
  emailLoading.value = true
  userService
    .post({ email: email.value })
    .then(() => {
      addNotification(t("notification.userRegisteredSuccessfully"), "success")
      loadUsers()
    })
    .catch(() => {
      addNotification(t("notification.userRegistrationFailed"), "error")
    })
    .finally(() => (emailLoading.value = false))
}

function unregisterUserFn() {
  if (!unregisterUser.value) return
  userService
    .deleteUser(unregisterUser.value?.id)
    .then(() => {
      loadUsers()
      addNotification(t("notification.userUnregisteredSuccessfully"), "success")
    })
    .catch(() => addNotification(t("notification.userUnregistrationFailed"), "error"))
    .finally(() => (confirmDeleteActive.value = false))
}

function confirmUserUnregistration(user: User) {
  confirmDeleteActive.value = true
  unregisterUser.value = user
}

function loadUsers() {
  userService.get().then((res) => (users.value = res))
}

onMounted(() => loadUsers())
</script>

<template>
  <DeleteConfirmationDialog
    v-model="confirmDeleteActive"
    :confirm-text="t('button.unregister')"
    @confirm="unregisterUserFn"
  >
    {{ t("dialog.confirmUnregister") }} <strong>{{ unregisterUserName }}</strong
    >{{ t("dialog.actionCannotBeUndone") }}
  </DeleteConfirmationDialog>

  <v-card class="mb-2">
    <v-card-title class="d-flex align-center">
      <v-icon icon="mdi-account-group"></v-icon> &nbsp; {{ t("table.trainers") }}

      <v-text-field
        class="ml-3"
        v-model="search"
        density="compact"
        :label="t('form.search')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        flat
        hide-details
        single-line
      ></v-text-field>
    </v-card-title>

    <v-card-text>
      <v-divider></v-divider>

      <v-data-table :loading="tableLoading" :headers="headers" :items="users" :search="search">
        <!-- eslint-disable-next-line -->
        <template #item.actions="{ item }">
          <v-btn
            variant="text"
            color="grey-darken-1"
            :v-tooltip:bottom="t('button.unregister')"
            icon="mdi-close-circle-outline"
            @click="confirmUserUnregistration(item)"
          ></v-btn>
        </template>
      </v-data-table>

      <v-divider></v-divider>
      <v-form v-model="isFormValid" @submit.prevent="addNew" class="mt-2">
        <v-row class="align-center">
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="email"
              :rules="emailRules"
              variant="outlined"
              density="compact"
              hide-details="auto"
              clearable
              :placeholder="t('form.newTrainerEmailPlaceholder')"
              :label="t('form.newTrainerEmail')"
              prepend-inner-icon="mdi-email-plus-outline"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-btn
              :loading="emailLoading"
              :disabled="!isFormValid"
              color="primary"
              type="submit"
              block
              variant="tonal"
            >
              <v-icon start icon="mdi-account-plus"></v-icon>
              {{ t("button.registerTrainer") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
  <CategoriesPage />
</template>
