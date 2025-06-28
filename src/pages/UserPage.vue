<script setup lang="ts">
import { useUser } from "@/composables/useUser"
import { userService } from "@/services/user"
import type { User } from "@/types/user"
import { useTemplateRef } from "vue"
import { onMounted } from "vue"
import { ref } from "vue"

const { userId } = useUser()
const user = ref<User>()
const fileInput = useTemplateRef("fileInput")
const avatarFile = ref<File>()

function editAvatar() {
  fileInput.value?.click()
}

onMounted(() => {
  if (!userId) return
  userService.get({ id: userId }).then((res) => (user.value = res[0]))
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
              <v-img
                src="https://cdn.vuetifyjs.com/images/john.jpg"
                :alt="user.name + ' Avatar'"
              ></v-img>
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
          @change="console.log('change avatar')"
        ></v-text-field>

        <v-text-field v-model="user.email" label="Email" readonly variant="outlined"></v-text-field>
      </v-card-text>

      <v-file-input
        ref="fileInput"
        v-model="avatarFile"
        accept="image/*"
        style="display: none"
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
