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
</script>

<template>
  <div ref="dropZoneRef" :class="{ isOverDropZone }" class="relative size-full overflow-hidden">
    <div class="grain"></div>
    <label
      :class="[
        { 'bg-surface-container-high': isOverDropZone },
        'flex',
        'size-full',
        'min-h-32',
        'cursor-pointer',
        'flex-col',
        'items-center',
        'justify-center',
        'overflow-hidden',
        'bg-surface-container-low',
        'transition-colors',
        'duration-300',
        'ease-in-out',
        'hover:bg-surface-container-high',
        'focus:bg-surface-container-high',
        'active:bg-surface-container-highest'
      ]"
      :for="`dropzone-file-${id}`"
      v-bind="$attrs"
    >
      <span class="flex flex-col items-center justify-center">
        <Icon class="mb-2 size-8" name="ic:round-cloud-upload" />
        <span class="text-sm leading-loose text-on-surface-variant">
          <span class="font-semibold">
            {{ device.isDesktopOrTablet ? 'Click here to upload' : 'Tap here to upload' }}
          </span>
          {{ device.isDesktopOrTablet ? ' or drag and drop' : '' }}
        </span>
        <span class="text-xs leading-snug">PNG, JPG, SVG or WEBP</span>
      </span>
      <input
        :id="`dropzone-file-${id}`"
        accept="image/*"
        class="hidden"
        type="file"
        @change="onChange"
      />
    </label>
  </div>
</template>

<style scoped>
.grain {
  @apply pointer-events-none absolute inset-0 size-full;

  --_opacity: 0.15;

  &:before {
    content: '';
    position: absolute;
    top: -10rem;
    left: -10rem;
    width: calc(100% + 20rem);
    height: calc(100% + 20rem);
    background-image: url(https://upload.wikimedia.org/wikipedia/commons/5/5c/Image_gaussian_noise_example.png);
    pointer-events: none;
    opacity: var(--_opacity);
    animation: noise 1s steps(2) infinite;
  }
}

@keyframes noise {
  0% {
    transform: translate3d(0, 9rem, 0);
  }
  10% {
    transform: translate3d(-1rem, -4rem, 0);
  }
  20% {
    transform: translate3d(-8rem, 2rem, 0);
  }
  30% {
    transform: translate3d(9rem, -9rem, 0);
  }
  40% {
    transform: translate3d(-2rem, 7rem, 0);
  }
  50% {
    transform: translate3d(-9rem, -4rem, 0);
  }
  60% {
    transform: translate3d(2rem, 6rem, 0);
  }
  70% {
    transform: translate3d(7rem, -8rem, 0);
  }
  80% {
    transform: translate3d(-9rem, 1rem, 0);
  }
  90% {
    transform: translate3d(6rem, -5rem, 0);
  }
  to {
    transform: translate3d(-7rem, 0, 0);
  }
}

.isOverDropZone {
}
</style>
