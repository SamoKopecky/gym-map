<script setup lang="ts">
import { categoryService } from "@/services/category"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { type Category, type CategoryProperties } from "@/types/category"
import { useDebounceFn } from "@vueuse/core"
import { onMounted } from "vue"
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog.vue"

const { addNotification } = useNotificationStore()
const categories = ref<CategoryProperties[]>([])
const toDeleteCategory = ref<CategoryProperties>()
const toDeleteActive = ref(false)
const { t } = useI18n()

function newCategory() {
  categoryService
    .post({ name: "new category" })
    .then((res) => {
      categories.value.push({ name: res.name, id: res.id, properties: [] })
      addNotification("Category added", "success")
    })
    .catch(() => addNotification("Failed to add category", "error"))
}

function deleteCategory(id: number) {
  categoryService.delete(id).then(() => {
    categories.value = categories.value.filter((c) => c.id !== id)
    addNotification("Category deleted", "success")
  })
}

const updateNameDebounce = useDebounceFn(
  (category: Category) =>
    categoryService
      .patch({ name: category.name, id: category.id })
      .catch(() => addNotification("Failed to change category name", "error")),
  1000,
)

onMounted(() => {
  categoryService.getCategoryProperties().then((res) => (categories.value = res))
})
</script>

<template>
  <DeleteConfirmationDialog
    v-if="toDeleteCategory"
    v-model="toDeleteActive"
    :confirm-text="t('button.delete')"
    @confirm="deleteCategory(toDeleteCategory.id)"
  >
    Are you sure you want to delete <b>{{ toDeleteCategory.name }}</b
    >? This action cannot be undone.
  </DeleteConfirmationDialog>

  <v-card title="Exercise categories">
    <v-card-text>
      <v-card v-for="category in categories" :key="category.id" variant="flat">
        <v-card-title>
          <div class="d-flex align-center">
            <v-text-field
              v-model="category.name"
              variant="plain"
              hide-details="auto"
              placeholder="Category name:..."
              @update:model-value="updateNameDebounce(category)"
            />
            <v-btn
              class="ml-2"
              icon="mdi-close"
              variant="text"
              color="error"
              v-tooltip:bottom="'Delete'"
              @click="
                () => {
                  toDeleteCategory = category
                  toDeleteActive = true
                }
              "
            />
          </div>
        </v-card-title>
        <v-card-text>
          <v-combobox chips multiple variant="outlined" persistent-hint hide-details="auto" />
        </v-card-text>
      </v-card>

      <v-btn class="mt-2" @click="newCategory"> Add new category </v-btn>
    </v-card-text>
  </v-card>
</template>
