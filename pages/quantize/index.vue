<script lang="ts" setup>
import NumericTextField from '~/components/InputNumberText.vue'

const store = useFilesStore()
const { files, selectedFile, fileObjectUrl } = storeToRefs(store)
const { reset } = store

function onDrop(droppedFiles: File[]) {
  files.value = droppedFiles
}

const images = [
  '/img/purplish-landscape.jpg',
  '/img/islands.jpg',
  '/img/supernova.jpg',
  '/img/mushrooms.jpg',
  // '/img/squirrel.jpg',
  // '/img/kitten.jpg',
  '/img/forest-nightfall.jpg',
  // '/img/winter.jpg',
  '/img/bird.jpg'
  // '/img/wp-landscape.webp'
] as const

async function blobFromUrl(url: string) {
  const response = await fetch(url)
  return await response.blob()
}

function fileFromBlob(blob: Blob, img: string) {
  return new File([blob], 'example.jpg', {
    type: img.slice(img.lastIndexOf('.'))
  })
}

async function fileFromImagePath(img: string): Promise<File> {
  const blob = await blobFromUrl(img)
  return fileFromBlob(blob, img)
}

const state = reactive({
  isLoadingExample: false,
  isLoadingNextPage: false
})

async function loadExampleImage() {
  state.isLoadingExample = true
  const exampleImage = images[Math.floor(Math.random() * images.length)]
  const file = await fileFromImagePath(exampleImage)
  files.value = [file]
  state.isLoadingExample = false
}

const maxColors = ref<number>(128)

async function onExtractColors() {
  state.isLoadingNextPage = true

  const execute = async () => {
    if (!selectedFile.value) return
    await navigateTo({
      path: `/quantize/${selectedFile.value.name}`,
      query: { maxColors: maxColors.value }
    })
  }

  if (!document.startViewTransition) {
    await execute()
    return
  }

  const transition = document.startViewTransition(async () => {
    await execute()
  })

  await transition.finished

  state.isLoadingNextPage = false
}

function onCustomFIleChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    files.value = Array.from(target.files)
  }
}

const textContent = reactive({
  title: 'Extract colors from image',
  description: 'The image is digitally analyzed to extract the colors from it.'
})

const { open: openCamera, reset: resetCamera } = useFileDialog({
  accept: 'image/*',
  multiple: false,
  capture: 'environment'
})

function onTakeCapture() {
  resetCamera()
  openCamera()
}

const device = useDevice()
</script>

<template>
  <div class="mx-auto flex w-full max-w-xl flex-col p-4">
    <div class="mb-8">
      <h1 class="mb-2 text-4xl font-medium tracking-normal">
        {{ textContent.title }}
      </h1>
      <p class="text-body-sm text-on-surface-variant">
        {{ textContent.description }}
      </p>
    </div>

    <div
      :class="[
        selectedFile ? 'border-outline-variant' : 'border-dashed border-outline-variant',
        state.isLoadingExample ? 'animate-pulse duration-150' : ''
      ]"
      class="relative mb-4 h-64 overflow-hidden rounded-md border-2"
    >
      <Transition mode="out-in" name="basic-out-in">
        <NuxtImg v-if="selectedFile" :src="fileObjectUrl" alt="" class="selected size-full" />
        <FileDropZone v-else class="rounded-md" @drop="onDrop" />
      </Transition>
    </div>

    <div class="mb-8 flex justify-end gap-2">
      <div v-if="device.isMobileOrTablet" class="flex gap-2">
        <Button intent="filled-tonal" size="sm" @click="onTakeCapture">
          Take a photo
          <Icon class="size-5" name="ic:round-photo-camera" />
        </Button>
      </div>
      <Button
        :disabled="state.isLoadingExample"
        class="w-[152px]"
        intent="text"
        size="sm"
        @click="loadExampleImage"
      >
        <Spinner v-if="state.isLoadingExample" class="size-5" />
        <template v-else>
          {{ selectedFile ? 'Change image' : 'Load example' }}
        </template>
      </Button>
    </div>
    <template v-if="selectedFile">
      <div class="flex flex-col justify-between">
        <label
          class="mb-2 flex flex-nowrap items-center gap-x-2 px-2 text-label-lg"
          for="maxColors"
        >
          Max Colors
          <span class="text-xs tabular-nums text-on-surface-variant">(1-128)</span>
          <Tooltip class="justify-self-end">
            <button class="flex items-center justify-center">
              <Icon class="ml-0.5 h-4 w-4 text-on-surface-variant" name="ic:baseline-info" />
            </button>
            <template #content> The maximum number of colors to generate from the image.</template>
          </Tooltip>
        </label>
        <div class="grid grid-cols-[1fr,52px]">
          <div class="px-2">
            <Slider v-model.number="maxColors" contained="true" max="128" min="1" step="1" />
          </div>
          <div class="px-2">
            <NumericTextField id="maxColors" v-model.number="maxColors" max="128" min="1" />
          </div>
        </div>
      </div>
    </template>
    <div class="mt-12 flex w-fit flex-col self-end">
      <div class="flex gap-2">
        <template v-if="selectedFile">
          <!-- reset -->
          <Button :disabled="state.isLoadingExample" intent="text" size="md" @click="reset">
            Cancel
          </Button>
        </template>
        <Button
          :disabled="!selectedFile || state.isLoadingNextPage"
          class="whitespace-nowrap"
          @click="onExtractColors"
        >
          <Spinner v-if="state.isLoadingNextPage" class="size-5" />
          <div class="flex items-center justify-center gap-2 leading-none">
            Extract Colors
            <Icon class="size-12" name="ic:round-arrow-right-alt" />
          </div>
        </Button>
      </div>
    </div>
  </div>
</template>

<style>
.basic-out-in-enter-active,
.basic-out-in-leave-active {
  transition: opacity 200ms ease-out;
}

.basic-out-in-enter-from,
.basic-out-in-leave-to {
  opacity: 0;
}

:not(.prevent-transition) {
  img.selected {
    view-transition-name: selected;
    z-index: 20;
  }
}

::view-transition-old(selected) {
  object-fit: contain;
}

::view-transition-new(selected) {
  object-fit: cover;
}

::view-transition-old(selected),
::view-transition-new(selected) {
  animation: none;
  mix-blend-mode: normal;
  height: 100%;
  overflow: clip;
}
</style>
