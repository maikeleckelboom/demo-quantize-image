<script lang="ts" setup>
import { useDropZone } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    dataTypes?: string[]
  }>(),
  { dataTypes: () => ['image/*'] }
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

const device = useDevice()
</script>

<template>
  <div ref="dropZoneRef" :class="{ isOverDropZone }" class="relative size-full">
    <template v-if="files?.length">
      <div class="absolute inset-0 size-full">
        <slot :files="files" name="dropped" />
      </div>
    </template>
    <label
      :class="[
        { 'bg-surface-container-high': isOverDropZone },
        'flex',
        'size-full',
        'h-64',
        'cursor-pointer',
        'flex-col',
        'items-center',
        'justify-center',
        'overflow-hidden',
        'rounded-lg',
        'border-2',
        'border-dashed',
        'border-outline-variant',
        'bg-surface-container-low',
        'transition-colors',
        'duration-300',
        'ease-in-out',
        'hover:bg-surface-container-high'
      ]"
      for="dropzone-file"
    >
      <span class="flex flex-col items-center justify-center pb-6 pt-5">
        <Icon name="ic:round-cloud-upload" />
        <span class="mb-2 inline text-sm text-on-surface-variant">
          <span class="font-semibold">
            {{ device.isDesktopOrTablet ? 'Click hereto upload' : 'Tap here  to upload' }}
          </span>
          {{ device.isDesktopOrTablet ? ' or drag and drop' : '' }}
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
