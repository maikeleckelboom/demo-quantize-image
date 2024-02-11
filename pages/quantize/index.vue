<script lang="ts" setup>
import MaxColorsInputSlider from '~/components/MaxColorsInputSlider.vue'

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
  isLoadingNextPage: false,
  isReadyForTransition: false
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

  const triggerTransition = async () => {
    if (!selectedFile.value) return
    return navigateTo({
      path: `/quantize/${selectedFile.value.name}`,
      query: { maxColors: maxColors.value }
    })
  }

  if (!document.startViewTransition) {
    await triggerTransition()
    return
  }

  const transition = document.startViewTransition(async () => {
    await triggerTransition()
    await nextTick()
  })

  await transition.ready.then(() => {
    console.log('Transition ready')
    state.isReadyForTransition = true
  })

  await transition.finished.then(() => {
    console.log('Transition finished')
    state.isLoadingNextPage = false
  })
}

const textContent = reactive({
  title: 'Quantize Image',
  description: 'Utilize digital analysis to extract vibrant colors from your images.'
})

const {
  files: cameraFiles,
  open: openCamera,
  reset: resetCamera
} = useFileDialog({
  accept: 'image/*',
  multiple: false,
  capture: 'environment'
})

function onTakeCapture() {
  resetCamera()
  openCamera()
}

whenever(cameraFiles, (capturedFiles) => {
  files.value = Array.from(capturedFiles)
})

const device = useDevice()
</script>

<template>
  <div class="mx-auto flex w-full max-w-xl flex-col p-4">
    <div class="mb-4 md:mb-8">
      <h1 class="mb-2 text-3xl font-medium tracking-normal md:text-4xl">
        {{ textContent.title }}
      </h1>
      <p class="hidden text-body-sm text-on-surface-variant md:inline-flex">
        {{ textContent.description }}
      </p>
    </div>

    <div
      :class="[
        selectedFile
          ? 'border-secondary-container/40'
          : 'border-dashed border-surface-variant',
        state.isLoadingExample ? 'animate-pulse duration-150' : ''
      ]"
      class="relative mb-3 h-52 overflow-hidden rounded-md border-2 md:mb-2.5 md:h-64"
    >
      <Transition mode="out-in" name="basic-out-in">
        <NuxtImg
          v-if="selectedFile"
          :src="fileObjectUrl"
          alt=""
          class="selected object-contain"
        />
        <FileDropZone v-else class="rounded-md" @drop="onDrop" />
      </Transition>
    </div>

    <div class="mb-4 flex justify-between gap-2 md:mb-8">
      <div v-if="device.isMobileOrTablet" class="flex gap-2">
        <IconButton class="rounded-md" @click="onTakeCapture">
          <Icon class="size-4" name="ic:round-photo-camera" />
        </IconButton>
      </div>
      <Button
        :disabled="state.isLoadingExample"
        class="rounded-md"
        intent="outlined"
        size="sm"
        @click="loadExampleImage"
      >
        <template v-if="state.isLoadingExample">
          Loading
          <Spinner class="size-4" />
        </template>
        <template v-else>
          {{ selectedFile ? 'Change image' : 'Load example' }}
        </template>
      </Button>
    </div>
    <div class="h-20">
      <MaxColorsInputSlider v-model="maxColors" />
    </div>
    <div class="mt-12 flex w-fit flex-col self-end">
      <div class="flex gap-3">
        <Button v-if="selectedFile" intent="text" size="md" @click="reset">
          Cancel
        </Button>
        <Button
          :disabled="!selectedFile || state.isLoadingNextPage"
          @click="onExtractColors"
        >
          <div class="flex items-center justify-center gap-2 leading-none">
            {{ state.isLoadingNextPage ? 'Loading' : 'Extract Colors' }}
          </div>
        </Button>
      </div>
    </div>
  </div>
</template>

<style>
.basic-out-in-enter-active,
.basic-out-in-leave-active {
  transition: opacity 150ms ease-out;
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
