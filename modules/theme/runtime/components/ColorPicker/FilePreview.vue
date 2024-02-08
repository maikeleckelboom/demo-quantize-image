<script lang="ts" setup>
const props = defineProps<{
  file: File | null
}>()

const url = useObjectUrl(props.file)
</script>

<template>
  <img :src="url" alt="" class="size-full min-h-32 rounded-md object-cover" />
</template>

<style scoped></style>
