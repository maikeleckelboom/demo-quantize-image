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

const id = useId()

watch(isOverDropZone, (value) => {
  if (value) {
    console.log('Entered drop zone')
  } else {
    console.log('Left drop zone')
  }
})
</script>

<template>
  <label
    ref="dropZoneRef"
    :class="[
      { 'bg-secondary-container/50': isOverDropZone },
      'flex',
      'size-full',
      'min-h-32',
      'cursor-pointer',
      'flex-col',
      'items-center',
      'justify-center',
      'overflow-hidden',
      'bg-secondary-container/10',
      'hover:bg-secondary-container/20',
      'active:bg-secondary-container/30'
    ]"
    :for="`dropzone-file-${id}`"
  >
    <span id="dropzone-text" class="flex flex-col items-center justify-center">
      <Icon class="md:md-2 size-8" name="ic:round-cloud-upload" />
      <span class="text-sm leading-loose text-on-surface-variant">
        <span class="font-semibold">
          {{ device.isDesktopOrTablet ? 'Click here to upload' : 'Tap here to upload' }}
        </span>
        {{ device.isDesktopOrTablet ? ' or drag and drop' : '' }}
      </span>
      <span class="text-xs leading-snug">PNG, JPG, SVG or WEBP</span>
    </span>
    <input :id="`dropzone-file-${id}`" accept="image/*" class="hidden" type="file" @change="onChange" />
  </label>
</template>

<style>
/*#dropzone-text {
  view-transition-name: dropzone-text;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(10px);
  }
}

!* Entry transition *!
::view-transition-new(dropzone-text):only-child {
  animation: 300ms cubic-bezier(0, 0, 0.2, 1) both fade-in;
}

!* Exit transition *!
::view-transition-old(dropzone-text):only-child {
  animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out;
}*/
</style>
