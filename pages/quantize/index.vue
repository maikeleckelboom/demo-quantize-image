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
  '/img/forest-nightfall.jpg'
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

  const triggerTransition = async () => {
    if (!selectedFile.value) return
    await navigateTo({
      path: `/quantize/${selectedFile.value.name}`,
      query: { maxColors: maxColors.value }
    })
    await nextTick()
  }

  if (!document.startViewTransition) {
    await triggerTransition()
    return
  }

  const transition = document.startViewTransition(async () => {
    await triggerTransition()
  })

  await transition.ready

  await transition.finished.then(() => {
    state.isLoadingNextPage = false
  })
}

const textContent = reactive({
  title: 'Extract Colors from Image',
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

const hasCapturedImage = computed(() => Array.from(cameraFiles?.value ?? []).length > 0)
const hasLoadedExample = computed(() => files.value.some((file) => file.name === 'example.jpg'))
const hasSelectedViaBrowse = computed(() => !!files.value.length && !hasCapturedImage.value)
</script>

<template>
  <div class="mx-auto flex w-full max-w-xl flex-col p-4">
    <div class="mb-4 flex-col md:mb-8 md:flex">
      <h1 class="text-title-lg font-medium md:mb-2 md:text-display-sm">
        {{ textContent.title }}
      </h1>
      <p class="hidden text-body-sm text-on-surface-variant md:flex">
        {{ textContent.description }}
      </p>
    </div>
    <div
      :class="[state.isLoadingExample ? 'animate-pulse duration-150' : '']"
      class="relative mb-2 h-52 overflow-hidden rounded md:mb-2.5 md:h-72"
    >
      <Transition mode="out-in" name="basic-out-in">
        <NuxtImg v-if="selectedFile" :src="fileObjectUrl" alt="" class="selected object-contain" />
        <FileDropZone v-else class="rounded" @drop="onDrop" />
      </Transition>
    </div>

    <div class="mb-4 flex justify-end gap-2">
      <div v-if="device.isMobileOrTablet" class="mr-auto">
        <Button class="rounded-md" intent="text" size="sm" @click="onTakeCapture">
          <Icon class="size-4" name="ic:round-photo-camera" />
          Take Capture
        </Button>
      </div>
      <Button v-if="selectedFile" class="rounded-md" intent="text" size="sm" @click="reset">
        Clear
      </Button>
      <Button
        v-if="!files?.length"
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
          {{ hasLoadedExample ? 'Reload' : 'Load Example' }}
        </template>
      </Button>
    </div>
    <div class="">
      <MaxColorsInputSlider v-model="maxColors" max="128" min="1" step="1" />
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
  /*
  object-fit: contain;
  */
}

::view-transition-new(selected) {
  object-fit: cover;
}

::view-transition-old(selected),
::view-transition-new(selected) {
  animation: none;
  mix-blend-mode: normal;
  overflow: clip;
  height: 100%;
}
</style>
