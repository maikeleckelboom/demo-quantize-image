<script lang="ts" setup>
import { useDropZone } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    dataTypes?: string[]
  }>(),
  { dataTypes: () => ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'] }
)

const emit = defineEmits<{
  drop: [files: File[]]
  enter: [files: File[] | null, event: DragEvent]
  leave: [files: File[] | null, event: DragEvent]
  over: [files: File[] | null, event: DragEvent]
}>()

const dropZoneRef = ref<HTMLDivElement>()

function onDrop(files: File[] | null) {
  if (!files) return
  emit('drop', files)
}

function onEnter(files: File[] | null, event: DragEvent) {
  emit('enter', files, event)
}

function onLeave(files: File[] | null, event: DragEvent) {
  emit('leave', files, event)
}

function onOver(files: File[] | null, event: DragEvent) {
  emit('over', files, event)
}

const { isOverDropZone, files } = useDropZone(dropZoneRef, {
  dataTypes: props.dataTypes,
  onDrop,
  onEnter,
  onLeave,
  onOver
})

function onChange(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files) return
  onDrop(Array.from(files))
}
</script>

<template>
  <div ref="dropZoneRef" :class="{ isOverDropZone }" class="flex w-full items-center justify-center">
    <label
      :class="{ 'bg-surface-container-high': isOverDropZone }"
      class="flex size-full h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low transition-colors duration-300 ease-in-out hover:bg-surface-container-high"
      for="dropzone-file"
    >
      <span class="flex flex-col items-center justify-center pb-6 pt-5">
        <svg
          class="mb-3 h-10 w-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
        <span class="mb-2 inline text-sm text-on-surface-variant">
          <span class="font-semibold">Click to upload</span> or drag and drop
        </span>
        <span class="text-xs">PNG, JPG, SVG or WEBP</span>
      </span>
      <input id="dropzone-file" class="hidden" type="file" @change="onChange" />
    </label>
  </div>
</template>

<style scoped>
.isOverDropZone {
}
</style>
