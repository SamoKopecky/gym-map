<script setup lang="ts">
import { userService } from "@/services/user"
import type { User } from "@/types/user"
import { onMounted } from "vue"
import { ref } from "vue"

const users = ref<User[]>([])

onMounted(() => userService.get().then((res) => (users.value = res)))
</script>

<template>
  <p v-for="user in users" :key="user.id">{{ user.email }}</p>
</template>
