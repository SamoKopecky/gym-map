<script setup lang="ts">
import { categoryService } from "@/services/category"
import { propertyService } from "@/services/property"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { type Category, type CategoryProperties } from "@/types/category"
import { type Property } from "@/types/property"
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
    .post({ name: t("categories.newCategoryName") })
    .then((res) => {
      categories.value.push({ name: res.name, id: res.id, properties: [] })
      addNotification(t("notification.categoryAdded"), "success")
    })
    .catch(() => addNotification(t("notification.categoryAddFailed"), "error"))
}

function deleteCategory(id: number) {
  categoryService.delete(id).then(() => {
    categories.value = categories.value.filter((c) => c.id !== id)
    addNotification(t("notification.categoryDeleted"), "success")
  })
}

const updateNameDebounceCat = useDebounceFn(
  (category: Category) =>
    categoryService
      .patch({ name: category.name, id: category.id })
      .catch(() => addNotification(t("notification.categoryNameChangeFailed"), "error")),
  1000,
)

const updateNameDebounceProp = useDebounceFn(
  (property: Property) =>
    propertyService
      .patch({ name: property.name, id: property.id })
      .catch(() => addNotification(t("notification.propertyNameChangeFailed"), "error")),
  1000,
)

function addProperty(category: CategoryProperties) {
  propertyService
    .post({ name: `property ${category.properties.length + 1}`, category_id: category.id })
    .then((res) => category.properties.push(res))
    .catch(() => addNotification(t("notification.propertyAddFailed"), "error"))
}

function deleteProperty(category: CategoryProperties, property: Property) {
  propertyService
    .delete(property.id)
    .then(() => (category.properties = category.properties.filter((p) => p.id !== property.id)))
    .catch(() => addNotification(t("notification.propertyDeleteFailed"), "error"))
}

onMounted(() => {
  categoryService.get().then((res) => (categories.value = res))
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

  <v-card :title="t('categories.title')">
    <v-card-text>
      <div v-for="category in categories" :key="category.id">
        <v-divider />
        <v-card variant="flat">
          <v-card-title>
            <div class="d-flex align-center">
              <v-text-field
                v-model="category.name"
                variant="plain"
                hide-details="auto"
                @update:model-value="updateNameDebounceCat(category)"
              />
              <v-btn
                class="ml-2"
                icon="mdi-close-circle-outline"
                variant="text"
                color="grey-darken-1"
                v-tooltip:bottom="t('categories.deleteTooltip')"
                @click="
                  () => {
                    toDeleteCategory = category
                    toDeleteActive = true
                  }
                "
              />
            </div>
          </v-card-title>
          <v-card-text class="ml-4">
            <div
              v-for="property in category.properties"
              :key="property.id"
              class="d-flex align-center mb-2"
            >
              <v-text-field
                v-model="property.name"
                variant="outlined"
                density="compact"
                hide-details="auto"
                :placeholder="t('categories.propertyPlaceholder')"
                @update:model-value="updateNameDebounceProp(property)"
              />
              <v-btn
                class="ml-2"
                icon="mdi-delete-outline"
                variant="text"
                color="error"
                v-tooltip:bottom="t('categories.deletePropertyTooltip')"
                @click="deleteProperty(category, property)"
              />
            </div>

            <v-btn class="mt-2" variant="text" color="primary" @click="addProperty(category)">
              <v-icon start>mdi-plus</v-icon>
              {{ t("categories.addNewProperty") }}
            </v-btn>
          </v-card-text>
        </v-card>
      </div>

      <v-btn class="mt-2" variant="tonal" color="primary" @click="newCategory">
        <v-icon start>mdi-plus-circle-outline</v-icon>
        {{ t("categories.addNewCategory") }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>
