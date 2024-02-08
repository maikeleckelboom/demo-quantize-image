<script lang="ts" setup>
const files = ref<File[]>([])

function onDrop(droppedFiles: File[] | null) {
  if (!droppedFiles) return
  files.value = droppedFiles
}

function resetFiles() {
  files.value = []
}

const { selectedFile, selectFile, clearSelection, isSelected } = useFileSelection(files)

watch(selectedFile, (v) => {
  console.log(v)
})
</script>

<template>
  <div class="mx-auto flex w-full max-w-xl flex-col gap-8 p-4">
    <div>
      <h1 class="mb-1 text-headline-sm">Upload an image to generate color palettes</h1>
      <p class="text-body-sm text-on-surface-variant">
        The image is digitally analyzed, a single color is selected as the source color, and tones are chosen
        and assigned to each color role.
      </p>
    </div>

    <div class="h-64">
      <FileDropZone @drop="onDrop" />
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div v-for="file in files" :key="file.name">
        <FilePreview :file="file" />
      </div>
    </div>
    <Buttons v-if="files.length">
      <Button intent="text" @click="resetFiles">Cancel</Button>
      <Button>Commit</Button>
    </Buttons>
  </div>
</template>

<style scoped></style>
