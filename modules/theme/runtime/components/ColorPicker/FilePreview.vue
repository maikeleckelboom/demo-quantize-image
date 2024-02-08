<script lang="ts" setup>
defineProps<{
  url: string
}>()
</script>

<template>
  <img :src="url" alt="" class="vt-source-element size-full min-h-32 rounded-md" />
</template>

<style scoped>
.vt-source-element {
  view-transition-name: source;
}
</style>
