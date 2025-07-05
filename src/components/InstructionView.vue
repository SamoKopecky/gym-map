<script setup lang="ts">
import { useUser } from "@/composables/useUser"
import { instructionService } from "@/services/instruction"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { type Instruction } from "@/types/instruction"
import { type FileInfo, type MediaBlob } from "@/types/other"
import { isArray } from "@/utils/other"
import { watchDebounced } from "@vueuse/core"
import { ref, watch } from "vue"
import { computed, reactive, useTemplateRef } from "vue"
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog.vue"
import { API_BASE_URL } from "@/services/base"
import { mediaService } from "@/services/media"
import type { AxiosProgressEvent } from "axios"

const emit = defineEmits(["delete:instruction"])

const instruction = defineModel<Instruction>({ required: true })

const media = reactive<MediaBlob>({
  loading: false,
})
const file = reactive<FileInfo>({})
const uplodFileInput = useTemplateRef("file-upload-input")
const deleteActive = ref(false)
const isStoring = ref(false)

const { isTrainer, userId, isAdmin } = useUser()
const { addNotification } = useNotificationStore()

const canEdit = computed(() => {
  const trainerOwns = isTrainer.value && userId === instruction.value.user_id
  // True if either train owns the instruction or its an admin
  return trainerOwns || isAdmin.value
})

watch(
  instruction,
  () => {
    getMedia()
  },
  { immediate: true },
)

watchDebounced(
  () => instruction.value.description,
  (newDescription) => {
    if (canEdit.value) {
      isStoring.value = true
      instructionService
        .patch({ id: instruction.value.id, description: newDescription })
        .catch(() => addNotification("Error saving description", "error"))
        .finally(() => (isStoring.value = false))
    }
  },
  { debounce: 1000 },
)

function getMedia() {
  if (instruction.value.media_id) {
    media.loading = true
    mediaService
      .getMetadata(instruction.value.media_id)
      .then((res) => {
        file.name = res.original_file_name
        media.url = `${API_BASE_URL}/media/${res.id}`
        media.type = res.content_type
      })
      .finally(() => (media.loading = false))
  } else {
    media.url = undefined
  }
}

function uploadFile(uploadFile: File | File[]) {
  uplodFileInput.value?.blur()
  const formData = new FormData()

  if (isArray(uploadFile)) {
    addNotification("Uploading multiple files not supported", "error")
    return
  } else {
    formData.append("file", uploadFile)
  }

  file.uploadProgress = 0
  instructionService
    .postFile(instruction.value.id, formData, (event: AxiosProgressEvent) => {
      file.uploadProgress = Math.round((100 * event.loaded) / event.total!)
    })
    .then((res) => {
      instruction.value.media_id = res.media_id
      getMedia()
      addNotification("File uploaded succesfully", "success")
    })
    .catch(() => addNotification("File upload failed", "error"))
    .finally(() => {
      file.uploadProgress = undefined
      file.data = undefined
    })
}

function deleteInstruction() {
  instructionService
    .delete(instruction.value.id)
    .then(() => {
      emit("delete:instruction")
      addNotification("Instruction succefully deleted", "success")
    })
    .catch(() => addNotification("Deletion failed", "error"))
}
</script>

<template>
  <DeleteConfirmationDialog
    v-model="deleteActive"
    confirm-text="Delete"
    @confirm="deleteInstruction"
  >
    Do you really want to delete this instruction? This action cannot be undone.
  </DeleteConfirmationDialog>

  <v-card variant="flat">
    <v-card-title class="d-flex align-center">
      <span class="text-h6">Instructions</span>
      <v-spacer></v-spacer>
      <v-btn
        v-if="canEdit"
        @click="deleteActive = true"
        color="error"
        icon="mdi-delete"
        variant="text"
      ></v-btn>
    </v-card-title>
    <v-card-text>
      <v-textarea
        variant="outlined"
        auto-grow
        v-model="instruction.description"
        :readonly="!canEdit"
      >
        <template #append-inner>
          <div v-if="isStoring">
            <v-progress-circular size="20" indeterminate />
            <span>Saving...</span>
          </div>
        </template>
      </v-textarea>
      <v-file-input
        v-if="canEdit"
        v-model="file.data"
        @update:model-value="uploadFile"
        :hint="file.name ?? 'No file found'"
        ref="file-upload-input"
        label="Upload new file"
        variant="outlined"
        show-size
        accept="video/*"
        placeholder="Chose a video file to uplad"
        prepend-icon=""
        prepend-inner-icon="mdi-video"
        persistent-hint
      >
      </v-file-input>
      <div v-if="file.uploadProgress" class="d-flex justify-center mt-2">
        <v-progress-circular
          :model-value="file.uploadProgress"
          color="primary"
          absolute
          size="100"
          width="12"
        >
          <h2>
            {{ file.uploadProgress }}
          </h2>
        </v-progress-circular>
      </div>

      <div class="d-flex justify-center mt-2">
        <v-progress-circular size="100" v-if="media.loading" indeterminate />
        <div v-else-if="media.url">
          <v-responsive v-show="media.url" aspect-ratio="16/9" max-width="500px">
            <video
              controls
              :src="media.url"
              :type="media.type"
              style="width: 100%; height: 100%; display: block"
            />
          </v-responsive>
        </div>
        <div v-else class="text-center text-grey">
          <v-icon size="64">mdi-video-off-outline</v-icon>
          <p class="mt-2">No video has been uploaded for this instruction.</p>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
