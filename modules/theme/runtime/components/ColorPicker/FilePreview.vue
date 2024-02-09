<script lang="ts" setup>
defineProps<{
  url: string
}>()
</script>

<template>
  <NuxtImg :src="url" alt="" class="selected size-full min-h-32 rounded-md" />
</template>

<style></style>
