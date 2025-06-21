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
const confirmDeleteActve = ref(false)
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
  console.log(unregisterUser.value)
  userService
    .deleteUser(unregisterUser.value?.id)
    .then(() => {
      loadUsers()
      addNotification("User unregistered succesfuly", "success")
    })
    .catch(() => addNotification("User unregistration failed", "error"))
    .finally(() => (confirmDeleteActve.value = false))
}

function confirmUserUnregistration(user: User) {
  confirmDeleteActve.value = true
  unregisterUser.value = user
}

function loadUsers() {
  userService.get().then((res) => (users.value = res))
}

onMounted(() => loadUsers())
</script>

<template>
  <v-dialog v-model="confirmDeleteActve">
    <!-- TODO: Make this look nice -->
    <v-card max-width="500px" title="Are you sure?">
      <template #text>
        <v-btn color="green" @click="unregisterUserFn">
          Yes I want to unregister {{ unregisterUserName }}</v-btn
        >
        <v-spacer />
        <v-btn class="mt-2" color="red" @click="confirmDeleteActve = false">
          No I don't want to unregister {{ unregisterUserName }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>

  <v-card title="Trainers" flat>
    <template #text>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      />
      <v-data-table :loading="tableLoading" :headers="headers" :items="users" :search="search">
        <!-- eslint-disable-next-line  -->
        <template #item.actions="{ item }">
          <v-btn
            variant="text"
            color="red"
            icon="mdi-close"
            @click="confirmUserUnregistration(item)"
          />
        </template>
      </v-data-table>

      <v-form v-model="isFormValid" @submit.prevent>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          variant="outlined"
          hide-details="auto"
          clearable
          placeholder="Enter email of new trainer"
          label="Email"
          prepend-inner-icon="mdi-email"
        />

        <v-btn
          class="mt-1"
          :loading="emailLoading"
          :disabled="!isFormValid"
          color="green"
          @click="addNew"
          >Register new trainer</v-btn
        >
      </v-form>
    </template>
  </v-card>
</template>
