<script lang="ts" setup>
defineProps<{
  url: string
}>()
</script>

<template>
  <NuxtImg :src="url" alt="" class="selected aspect-video min-h-32 rounded-md" />
</template>

<style></style>
