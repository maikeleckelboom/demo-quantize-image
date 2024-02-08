<script lang="ts" setup>
const files = ref<File[]>([])

function onDrop(droppedFiles: File[]) {
  files.value = droppedFiles
}

function resetFiles() {
  files.value = []
}

const { selectedFile, selectFile, isSelected } = useFileSelection(files)

watch(selectedFile, (v) => {
  console.log(v)
})

watch(files, (v) => {
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
    <Buttons v-if="selectedFile">
      <Button intent="text" @click="resetFiles">Cancel</Button>
      <Button>Commit</Button>
    </Buttons>
  </div>
</template>

<style scoped></style>
