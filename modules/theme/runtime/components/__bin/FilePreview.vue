<script lang="ts" setup>
const props = defineProps<{
  file: File | null
}>()

const url = useObjectUrl(props.file)
</script>

<template>
  <img :src="url" alt="" class="aspect-auto min-h-24 w-full" />
</template>

<style scoped></style>
