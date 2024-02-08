<script lang="ts" setup>
const props = defineProps<{
  file: File | null
}>()

const url = useObjectUrl(props.file)
</script>

<template>
  <img :src="url" alt="" class="min-size-24" />
</template>

<style scoped></style>
