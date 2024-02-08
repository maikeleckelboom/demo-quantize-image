<script lang="ts" setup>
const props = defineProps<{
  files: File[]
}>()

const { selectedFile, selectFile, isSelected } = useFileSelection(props.files)
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <div
      v-for="(file, index) in files"
      :key="file.name"
      :class="isSelected(index) ? 'border-primary' : 'border-transparent'"
      :data-selected="isSelected(index)"
      class="relative overflow-clip rounded-md border-2 [&:not([data-selected=true])]:hover:border-primary/50"
      @click="selectFile(index)"
    >
      <FilePreview :file="file" />
    </div>
  </div>
</template>

<style scoped></style>
