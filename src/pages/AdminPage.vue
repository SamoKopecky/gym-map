<script setup lang="ts">
import { userService } from "@/services/user"
import { useNotificationStore } from "@/stores/useNotificationStore"
import type { User } from "@/types/user"
import { computed } from "vue"
import { onMounted } from "vue"
import { ref } from "vue"

const users = ref<User[]>([])
const search = ref<string>()
const email = ref<string>()
const tableLoading = ref(false)
const emailLoading = ref(false)
const isFormValid = ref(true)
const confirmDeleteActive = ref(false)
const unregisterUser = ref<User>()

const { addNotification } = useNotificationStore()

const unregisterUserName = computed(() => unregisterUser.value?.name ?? unregisterUser.value?.email)

const emailRules = [(value: string) => /.+@.+\..+/.test(value) || "E-mail must be valid."]

const headers = [
  { key: "name", title: "Name" },
  { key: "email", title: "Email" },
  { key: "actions", title: "Actions" },
]

function addNew() {
  if (!email.value) return
  emailLoading.value = true
  userService
    .post({ email: email.value })
    .then(() => {
      addNotification("User registered sucesfully", "success")
      loadUsers()
    })
    .catch(() => {
      addNotification("User registration failed", "error")
    })
    .finally(() => (emailLoading.value = false))
}

function unregisterUserFn() {
  if (!unregisterUser.value) return
  userService
    .deleteUser(unregisterUser.value?.id)
    .then(() => {
      loadUsers()
      addNotification("User unregistered succesfuly", "success")
    })
    .catch(() => addNotification("User unregistration failed", "error"))
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
  <v-dialog v-model="confirmDeleteActive" max-width="500px">
    <v-card>
      <v-card-title class="text-h5 text-center">Are you sure?</v-card-title>
      <v-card-text class="text-center">
        Do you really want to unregister <strong>{{ unregisterUserName }}</strong
        >? This action cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="confirmDeleteActive = false">
          Cancel
        </v-btn>
        <v-btn color="red-darken-1" variant="tonal" @click="unregisterUserFn"> Unregister </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-card>
    <v-card-title class="d-flex align-center">
      <v-icon icon="mdi-account-group"></v-icon> &nbsp; Trainers

      <v-text-field
        class="ml-3"
        v-model="search"
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        flat
        hide-details
        single-line
      ></v-text-field>
    </v-card-title>

    <v-divider></v-divider>

    <v-data-table :loading="tableLoading" :headers="headers" :items="users" :search="search">
      <!-- eslint-disable-next-line -->
      <template #item.actions="{ item }">
        <v-btn
          variant="text"
          color="grey-darken-1"
          v-tooltip:bottom="'Unregister'"
          icon="mdi-close-circle-outline"
          @click="confirmUserUnregistration(item)"
        ></v-btn>
      </template>
    </v-data-table>

    <v-divider></v-divider>

    <v-card-text>
      <v-form v-model="isFormValid" @submit.prevent="addNew">
        <v-row class="align-center">
          <v-col cols="12" sm="8">
            <v-text-field
              v-model="email"
              :rules="emailRules"
              variant="outlined"
              density="compact"
              hide-details="auto"
              clearable
              placeholder="Enter email of new trainer"
              label="New Trainer Email"
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
              Register Trainer
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>
