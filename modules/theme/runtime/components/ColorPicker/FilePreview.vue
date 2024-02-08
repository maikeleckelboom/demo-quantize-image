<script lang="ts" setup>
const props = defineProps<{
  url: string
}>()
</script>

<template>
  <img :src="url" alt="" class="size-full min-h-32 rounded-md" />
</template>

<style scoped></style>
