<script setup lang="ts">
import { useUser } from "@/composables/useUser"
import { instructionService } from "@/services/instruction"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { type Instruction } from "@/types/instruction"
import { type FileInfo, type MediaInfo } from "@/types/other"
import { isArray, extractYouTubeId, isYouTubeUrl } from "@/utils/other"
import { watchDebounced } from "@vueuse/core"
import { ref, watch } from "vue"
import { computed, reactive, useTemplateRef } from "vue"
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog.vue"
import { API_BASE_URL } from "@/services/base"
import { mediaService } from "@/services/media"
import type { AxiosProgressEvent } from "axios"
import { MediaType } from "@/types/media"

const emit = defineEmits(["delete:instruction"])

const instruction = defineModel<Instruction>({ required: true })

const youtubeRules = [(value: string) => isYouTubeUrl(value) || "YouTube link is invalid"]

const medias = ref<MediaInfo[]>([])
const mediaLoading = ref(false)
const file = reactive<FileInfo>({})
const uplodFileInput = useTemplateRef("file-upload-input")
const deleteInstructionActive = ref(false)
const deleteMediaActive = ref(false)
const isStoring = ref(false)
const carouselIndex = ref<number>(0)
const mediaUploadType = ref<MediaType>(MediaType.File)
const youtubeLinkRef = ref<string>()

const { isTrainer, userId, isAdmin } = useUser()
const { addNotification } = useNotificationStore()

const canEdit = computed(() => {
  const trainerOwns = isTrainer.value && userId === instruction.value.user_id
  // True if either train owns the instruction or its an admin
  return trainerOwns || isAdmin.value
})

const currentMedia = computed(() => {
  if (medias.value.length === 0) return

  const currentMedia = medias.value.at(carouselIndex.value)
  if (!currentMedia) return

  return currentMedia
})

const mediaName = computed(() => {
  if (!currentMedia.value) return

  return currentMedia.value.name
})

watch(currentMedia, (newMedia) => {
  if (!newMedia) return

  if (newMedia.type === MediaType.Youtube) mediaUploadType.value = MediaType.Youtube
  else mediaUploadType.value = MediaType.File
})

watch(
  () => instruction.value.id,
  () => {
    getMedia()
  },
  { immediate: true },
)

watchDebounced(
  youtubeLinkRef,
  () => {
    if (!youtubeLinkRef.value) return
    const youtubeId = extractYouTubeId(youtubeLinkRef.value)
    if (!youtubeId) return

    instructionService
      .postFile(instruction.value.id, undefined, undefined, {
        youtube_video_id: youtubeId,
        name: youtubeLinkRef.value,
      })
      .then((res) => {
        instruction.value.media_ids.push(...res.media_ids)
        getMedia().then(() => (carouselIndex.value = medias.value.length - 1))
        youtubeLinkRef.value = undefined
        addNotification("Link saved", "success")
      })
      .catch(() => addNotification("Can't savelink", "error"))
  },
  { debounce: 100 },
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

async function getMedia(): Promise<void> {
  if (instruction.value.media_ids.length > 0) {
    mediaLoading.value = true
    return mediaService
      .getMetadataMany(instruction.value.media_ids)
      .then((res) => {
        medias.value = res.map((r) => {
          return {
            url: r.content_type === MediaType.Youtube ? r.path : `${API_BASE_URL}/media/${r.id}`,
            type: r.content_type,
            name: r.name,
            id: r.id,
          }
        })
      })
      .finally(() => (mediaLoading.value = false))
  } else {
    medias.value = []
    return new Promise((resolve) => {
      resolve()
    })
  }
}

function uploadFile(uploadFile: File | File[]) {
  uplodFileInput.value?.blur()
  const formData = new FormData()

  if (isArray(uploadFile)) {
    uploadFile.forEach((uf, i) => {
      formData.append(`file_${i}`, uf)
    })
  } else {
    formData.append("file_0", uploadFile)
  }

  file.uploadProgress = 0
  instructionService
    .postFile(
      instruction.value.id,
      (event: AxiosProgressEvent) => {
        file.uploadProgress = Math.round((100 * event.loaded) / event.total!)
      },
      formData,
    )
    .then((res) => {
      instruction.value.media_ids.push(...res.media_ids)
      getMedia().then(() => (carouselIndex.value = medias.value.length - 1))
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

function deleteMedia() {
  if (!currentMedia.value) {
    addNotification("No media to delete", "info")
    return
  }

  mediaService
    .delete(currentMedia.value.id)
    .then(() => {
      medias.value = medias.value.filter((_, index) => index !== carouselIndex.value)
      // Move to next media
      carouselIndex.value = (carouselIndex.value + 1) % (medias.value.length - 2)
      addNotification("Media file deleted", "success")
    })
    .catch(() => addNotification("Deletion failed", "error"))
}
</script>

<template>
  <DeleteConfirmationDialog
    v-model="deleteInstructionActive"
    confirm-text="Delete"
    @confirm="deleteInstruction"
  >
    Do you really want to delete this instruction? This action cannot be undone.
  </DeleteConfirmationDialog>

  <DeleteConfirmationDialog
    v-model="deleteMediaActive"
    confirm-text="Delete"
    @confirm="deleteMedia"
  >
    Do you really want to delete file <b>{{ currentMedia?.name }}</b
    >? This action cannot be undone.
  </DeleteConfirmationDialog>

  <v-card variant="flat">
    <v-card-title class="d-flex align-center">
      <span class="text-h6">Instructions</span>
      <v-spacer></v-spacer>
      <v-btn
        v-if="canEdit"
        @click="deleteInstructionActive = true"
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

      <div v-if="canEdit">
        <v-btn-toggle
          v-model="mediaUploadType"
          mandatory
          variant="outlined"
          density="compact"
          divided
          class="mb-4 d-flex"
        >
          <v-btn :value="MediaType.File" class="flex-grow-1">
            <v-icon start>mdi-upload</v-icon>
            Media File
          </v-btn>
          <v-btn :value="MediaType.Youtube" class="flex-grow-1">
            <v-icon start>mdi-youtube</v-icon>
            YouTube Link
          </v-btn>
        </v-btn-toggle>

        <v-row>
          <v-col cols="12" md="10" xl="11">
            <v-file-input
              v-if="mediaUploadType === MediaType.File"
              v-model="file.data"
              @update:model-value="uploadFile"
              ref="file-upload-input"
              label="Upload new file"
              variant="outlined"
              show-size
              accept="video/*"
              hide-details="auto"
              placeholder="Chose a video file to uplad"
              prepend-icon=""
              prepend-inner-icon="mdi-video"
              persistent-hint
            />

            <v-text-field
              v-else
              label="Add new YouTube link"
              variant="outlined"
              v-model="youtubeLinkRef"
              :rules="youtubeRules"
              hide-details="auto"
              clearable
              placeholder="Paste YouTube video URL..."
              prepend-inner-icon="mdi-youtube"
            />
          </v-col>

          <v-col cols="12" md="2" xl="1" class="d-flex align-center">
            <v-btn color="red" @click="deleteMediaActive = true" width="100%">Delete media</v-btn>
          </v-col>
        </v-row>
      </div>

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

      <div class="d-flex justify-center mt-4">
        <v-progress-circular size="100" v-if="mediaLoading" indeterminate />

        <v-responsive
          v-else-if="medias.length > 0"
          :aspect-ratio="16 / 9"
          max-width="1440"
          class="mx-auto"
        >
          <p v-if="canEdit" class="text-center text-subtitle-1 font-weight-medium mb-2">
            {{ mediaName }}
          </p>
          <v-carousel
            hide-delimiters
            hide-delimiter-background
            v-model="carouselIndex"
            style="height: 100%"
            class="video-carousel"
          >
            <v-carousel-item v-for="m in medias" :key="m.url">
              <video
                v-if="m.type !== MediaType.Youtube"
                controls
                :src="m.url"
                :type="m.type"
                style="background-color: black"
                class="responsive-video"
              />
              <iframe
                v-else
                :src="`https://www.youtube-nocookie.com/embed/${m.url}?rel=0`"
                class="responsive-video"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </v-carousel-item>
            <v-overlay
              :scrim="false"
              content-class="w-100 h-100 d-flex flex-column align-center justify-space-between pointer-pass-through py-3"
              contained
              model-value
              no-click-animation
              persistent
            >
              <v-chip
                :text="`${carouselIndex + 1} / ${medias.length}`"
                color="#eee"
                size="small"
                variant="flat"
              />
            </v-overlay>
          </v-carousel>
        </v-responsive>
        <div v-else class="text-center text-grey">
          <v-icon size="64">mdi-video-off-outline</v-icon>
          <p class="mt-2">No video has been uploaded for this instruction.</p>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
/*
  This makes the slide itself a "containing block"
  for our absolutely positioned video.
*/
.video-carousel .v-carousel-item {
  position: relative;
}

/*
  This takes the video out of the normal layout flow and
  stretches it to cover its containing block (the v-carousel-item).
*/
.responsive-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
  /* Keep object-fit to prevent the video from stretching/distorting */
  object-fit: contain;
}
</style>
