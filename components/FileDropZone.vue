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

const { elementX, elementY, isOutside } = useMouseInElement(dropZoneRef)

const cursorRef = ref<HTMLDivElement>()

const xy = computed(() => {
  if (!cursorRef.value) return { x: 0, y: 0 }
  return {
    x: elementX.value - cursorRef.value.clientWidth / 2,
    y: elementY.value - cursorRef.value.clientHeight / 2
  }
})
</script>

<template>
  <div
    ref="dropZoneRef"
    :class="{ isOverDropZone }"
    class="group relative size-full overflow-hidden"
  >
    <div :class="['before:opacity-0', 'group-hover:before:opacity-10']" class="grain" />

    <div
      ref="cursorRef"
      :class="{
        'opacity-0': isOutside,
        'opacity-[0.03]': isOverDropZone || !isOutside
      }"
      :style="{
        transform: `translate(${xy.x}px,${xy.y}px)`,
        background:
          'radial-gradient(circle, rgb(var(--on-surface-rgb)), rgb(var(--inverse-surface-rgb)))'
      }"
      class="pointer-events-none absolute left-0 top-0 size-10 overflow-hidden rounded-full opacity-0 mix-blend-color-dodge"
    />

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
        'duration-200',
        'hover:bg-surface-container-high',
        'focus:bg-surface-container-high'
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
  @apply pointer-events-none absolute inset-0 size-full mix-blend-color-dodge;

  --_size: 200px;

  &:before {
    content: '';
    position: absolute;
    top: calc(-1 * var(--_size));
    left: calc(-1 * var(--_size));
    width: calc(100% + var(--_size) * 2);
    height: calc(100% + var(--_size) * 2);
    background-image: url('/img/gaussian_noise.png');
    pointer-events: none;
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
