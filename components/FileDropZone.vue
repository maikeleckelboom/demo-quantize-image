<script lang="ts" setup>
import { useDropZone } from '@vueuse/core'

const dropZoneRef = ref<HTMLDivElement>()

function onDrop(files: File[] | null) {
  // called when files are dropped on zone
  console.log(files)
}

function onEnter(files: File[] | null, event: DragEvent) {
  // called when files are dragged over zone
  console.log('enter', files, event)
}

function onLeave(files: File[] | null, event: DragEvent) {
  // called when files are dragged out of zone
  console.log('leave', files, event)
}

function onOver(files: File[] | null, event: DragEvent) {
  // called when files are dragged over zone
  console.log('over', files, event)
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  dataTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  onDrop,
  onEnter,
  onLeave,
  onOver
})
</script>

<template>
  <div ref="dropZoneRef" class="flex w-full items-center justify-center">
    <label
      class="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low transition-colors duration-300 ease-in-out hover:bg-surface-container-high"
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
          ></path>
        </svg>
        <p class="mb-2 text-sm text-on-surface-variant">
          <span class="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p class="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
      </span>
      <input id="dropzone-file" class="hidden" type="file" />
    </label>
  </div>
</template>

<style>
.v-dropzone {
}
</style>
