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
  '/img/forest-nightfall.jpg',
  '/img/bird.jpg'
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
    <div class="mb-4 hidden flex-col md:mb-8 md:flex">
      <h1 class="mb-2 text-3xl font-medium tracking-normal md:text-4xl">
        {{ textContent.title }}
      </h1>
      <p class="text-body-sm text-on-surface-variant">
        {{ textContent.description }}
      </p>
    </div>

    <div
      :class="[state.isLoadingExample ? 'animate-pulse duration-150' : '']"
      class="relative mb-3 h-52 overflow-hidden rounded md:mb-2.5"
    >
      <Transition mode="out-in" name="basic-out-in">
        <NuxtImg v-if="selectedFile" :src="fileObjectUrl" alt="" class="selected object-contain" />
        <FileDropZone v-else class="rounded" @drop="onDrop" />
      </Transition>
    </div>

    <div class="mb-6 flex justify-end gap-2 md:mb-8">
      <div v-if="device.isMobileOrTablet" class="mr-auto">
        <Button class="rounded-md" intent="text" size="sm" @click="onTakeCapture">
          <Icon class="size-4" name="ic:round-photo-camera" />
        </Button>
      </div>
      <Button v-if="selectedFile" intent="text" size="sm" @click="reset"> Clear</Button>

      <Button
        :disabled="state.isLoadingExample"
        class="rounded-md"
        intent="text"
        size="sm"
        @click="loadExampleImage"
      >
        <template v-if="state.isLoadingExample">
          Loading
          <Spinner class="size-4" />
        </template>
        <template v-else>
          {{ selectedFile ? 'Change image' : 'Load example image' }}
        </template>
      </Button>
    </div>
    <div class="h-20">
      <MaxColorsInputSlider v-model="maxColors" :disabled="!selectedFile" max="128" min="1" step="1" />
    </div>
    <div class="mt-12 flex w-fit flex-col self-end">
      <div class="flex gap-3">
        <Button :disabled="!selectedFile || state.isLoadingNextPage" @click="onExtractColors">
          <div class="flex items-center justify-center gap-2 px-4 leading-none">
            {{ state.isLoadingNextPage ? 'Loading' : 'Extract Colors' }}
          </div>
        </Button>
      </div>
    </div>
  </div>
</template>

<style>
.dropzone-container {
  --_border-color: rgb(var(--outline-variant-rgb));

  background-image: repeating-linear-gradient(
      0deg,
      var(--_border-color),
      var(--_border-color) 10px,
      transparent 10px,
      transparent 20px,
      var(--_border-color) 20px
    ),
    repeating-linear-gradient(
      90deg,
      var(--_border-color),
      var(--_border-color) 10px,
      transparent 10px,
      transparent 20px,
      var(--_border-color) 20px
    ),
    repeating-linear-gradient(
      180deg,
      var(--_border-color),
      var(--_border-color) 10px,
      transparent 10px,
      transparent 20px,
      var(--_border-color) 20px
    ),
    repeating-linear-gradient(
      270deg,
      var(--_border-color),
      var(--_border-color) 10px,
      transparent 10px,
      transparent 20px,
      var(--_border-color) 20px
    );
  background-size:
    2px 100%,
    100% 2px,
    2px 100%,
    100% 2px;
  background-position:
    0 0,
    0 0,
    100% 0,
    0 100%;
  background-repeat: no-repeat;
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
