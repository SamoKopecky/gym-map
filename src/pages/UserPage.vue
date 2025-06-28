<script setup lang="ts">
import { useUser } from "@/composables/useUser"
import { API_BASE_URL } from "@/services/base"
import { userService } from "@/services/user"
import { useNotificationStore } from "@/stores/useNotificationStore"
import type { User } from "@/types/user"
import { isArray } from "@/utils/other"
import { computed } from "vue"
import { useTemplateRef } from "vue"
import { onMounted } from "vue"
import { ref } from "vue"

const { userId } = useUser()
const user = ref<User>()
const fileInput = useTemplateRef("fileInput")
const avatarFile = ref<File>()

const avatarUrl = computed(() => {
  if (!user.value?.avatar_id) return undefined
  return `${API_BASE_URL}/media/${user.value.avatar_id}`
})

const { addNotification } = useNotificationStore()

function editAvatar() {
  fileInput.value?.click()
}

function uploadNewAvatar(uploadFile: File | File[]) {
  const formData = new FormData()

  if (isArray(uploadFile)) {
    addNotification("Uploading multiple files not supported", "error")
    return
  } else {
    formData.append("file", uploadFile)
  }
  userService
    .postFile(formData)
    .then((res) => {
      if (!user.value) return
      user.value.avatar_id = res.avatar_id
      addNotification("Avatar updated", "success")
    })
    .catch(() => addNotification("Avatar update failed", "error"))
}

onMounted(() => {
  if (!userId) return
  userService.getUser(userId).then((res) => (user.value = res))
})
</script>

<template>
  <v-container class="d-flex justify-center align-center fill-height" v-if="user">
    <v-card class="pa-4" width="400">
      <v-card-title class="text-h5 text-center"> User Profile </v-card-title>
      <v-card-text>
        <div class="d-flex justify-center">
          <div class="avatar-container" @click="editAvatar">
            <v-avatar size="128">
              <v-img v-if="avatarUrl" :src="avatarUrl" :alt="user.name + ' Avatar'" />
              <v-icon icon="mdi-account-circle" size="128" v-else />
            </v-avatar>
            <div class="avatar-overlay">
              <v-icon color="white" size="x-large">mdi-pencil</v-icon>
            </div>
          </div>
        </div>

        <v-text-field
          v-model="user.name"
          label="Name"
          readonly
          variant="outlined"
          class="mt-6 mb-2"
        ></v-text-field>

        <v-text-field v-model="user.email" label="Email" readonly variant="outlined"></v-text-field>
      </v-card-text>

      <v-file-input
        ref="fileInput"
        v-model="avatarFile"
        accept="image/*"
        style="display: none"
        @update:model-value="uploadNewAvatar"
      ></v-file-input>
    </v-card>
  </v-container>
</template>

<style scoped>
.fill-height {
  min-height: 100vh;
}

.avatar-container {
  position: relative;
  cursor: pointer;
  /* Match the avatar's circular shape */
  border-radius: 50%;
  overflow: hidden;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4); /* Semi-transparent black overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0; /* Hidden by default */
  transition: opacity 0.3s ease;
}

.avatar-container .v-img {
  transition: filter 0.3s ease;
}

/* When hovering over the container... */
.avatar-container:hover .avatar-overlay {
  opacity: 1; /* ...make the overlay visible. */
}

.avatar-container:hover .v-img {
  filter: brightness(60%); /* ...dim the avatar image. */
}
</style>
