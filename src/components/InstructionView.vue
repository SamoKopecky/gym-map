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

const emit = defineEmits(["delete:instruction"])

const instruction = defineModel<Instruction>({ required: true })

const media = reactive<MediaBlob>({
  loading: false,
})
const file = reactive<FileInfo>({
  loading: false,
})
const uplodFileInput = useTemplateRef("file-upload-input")
const deleteActive = ref(false)

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
    file.name = instruction.value.file_name
    getMediaBlob()
  },
  { immediate: true },
)

watchDebounced(
  () => instruction.value.description,
  (newDescription) => {
    if (canEdit.value) {
      instructionService.patch({ id: instruction.value.id, description: newDescription })
    }
  },
  { debounce: 500 },
)

function revokeMediaBlob() {
  if (media.url) {
    URL.revokeObjectURL(media.url)
    media.url = undefined
    media.type = undefined
  }
}

function getMediaBlob() {
  revokeMediaBlob()
  media.loading = true
  instructionService
    .getFile(instruction.value.id)
    .then((res) => {
      if (res.type == "text/xml") return
      const blob = res
      media.type = blob.type
      media.url = URL.createObjectURL(blob)
    })
    .finally(() => (media.loading = false))
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

  file.loading = true
  instructionService
    .postFile(instruction.value.id, formData)
    .then(() => {
      getMediaBlob()
      addNotification("File uploaded succesfully", "success")
      file.name = uploadFile.name
    })
    .catch(() => addNotification("File upload failed", "error"))
    .finally(() => {
      file.loading = false
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
      />
      <v-file-input
        v-if="canEdit"
        v-model="file.data"
        @update:model-value="uploadFile"
        :hint="file.name ?? 'No file found'"
        :loading="file.loading"
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

      <div class="d-flex justify-center">
        <v-progress-circular size="100" v-if="media.loading" indeterminate />
        <v-responsive v-else v-show="media.url" aspect-ratio="16/9" max-width="500px">
          <video
            controls
            :src="media.url"
            :type="media.type"
            style="width: 100%; height: 100%; display: block"
          />
        </v-responsive>
      </div>
    </v-card-text>
  </v-card>
</template>
