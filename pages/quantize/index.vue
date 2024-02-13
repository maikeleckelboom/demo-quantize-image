<script lang="ts" setup>
import MaxColorsInputSlider from '~/components/Input/MaxColorsInputSlider.vue'
import { useDropZone } from '@vueuse/core'

const store = useFilesStore()
const { files, selectedFile, fileObjectUrl } = storeToRefs(store)
const { reset } = store

function onDrop(droppedFiles: File[] | null) {
  if (!droppedFiles) return
  files.value = droppedFiles
}

const images = ['/img/islands.jpg', '/img/mushrooms.jpg', '/img/forest-nightfall.jpg'] as const

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

const isLoadingImage = ref<boolean>(false)
const isLoadingNav = ref<boolean>(false)

async function loadExampleImage() {
  isLoading.value = true
  const exampleImage = images[Math.floor(Math.random() * images.length)]
  const file = await fileFromImagePath(exampleImage)
  files.value = [file]
  isLoading.value = false
}

const maxColors = ref<number>(128)

const isLoading = ref<boolean>(false)

async function onExtractColors() {
  isLoadingNav.value = true

  const trigger = async () => {
    await nextTick()
    navigateTo({
      path: `/quantize/${selectedFile.value?.name || 'image'}`,
      query: { maxColors: maxColors.value }
    })
  }

  if (!document.startViewTransition) {
    await trigger()
    return
  }

  const transition = document.startViewTransition(async () => {
    await trigger()
  })

  await transition.ready
  await transition.finished

  isLoadingNav.value = false
}

const textContent = reactive({
  title: 'Extract Colors from Image',
  description: [
    'Utilize digital analysis to extract vibrant colors from your images.',
    'Use the extracted colors to create color palettes, themes, and more.'
  ]
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
  isLoading.value = true
  resetCamera()
  openCamera()
}

whenever(cameraFiles, (capturedFiles) => {
  files.value = Array.from(capturedFiles)
  isLoading.value = false
})

const device = useDevice()

const hasCapturedImage = computed(() => Array.from(cameraFiles?.value ?? []).length > 0)
const hasLoadedExample = computed(() => files.value.some((file) => file.name === 'example.jpg'))
const hasSelectedViaBrowse = computed(() => !!files.value.length && !hasCapturedImage.value)

onBeforeRouteLeave(() => {
  isLoading.value = false
  isLoadingNav.value = false
})

const dropZoneRef = ref<HTMLElement | null>(null)
const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop
})

watch(isOverDropZone, (value) => {
  if (value) {
    console.log('Entered drop zone')
  } else {
    console.log('Left drop zone')
  }
})

const id = useId()

function onFileHandleResult(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files) return
  store.files = Array.from(files)
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-xl flex-col p-4">
    <div class="mb-6 flex-col md:mb-10 md:flex">
      <h1 class="mb-2 text-title-lg font-medium md:text-headline-md">
        {{ textContent.title }}
      </h1>
      <p class="text-body-sm text-on-surface-variant md:inline">
        {{ textContent.description.at(0) }}
        <span class="hidden md:inline">
          {{ textContent.description.at(1) }}
        </span>
      </p>
    </div>
    <div
      :class="[isLoading ? 'animate-pulse' : '']"
      class="relative mb-4 h-52 overflow-hidden rounded-lg border border-dotted border-surface-variant bg-surface-container/50 md:min-h-72"
    >
      <template v-if="selectedFile">
        <NuxtImg :src="fileObjectUrl" alt="" class="selected size-full rounded-lg object-scale-down" />
      </template>
      <template v-else>
        <label
          ref="dropZoneRef"
          :class="[
            { 'bg-secondary-container/50': isOverDropZone },
            'rounded-lg',
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
          <input
            :id="`dropzone-file-${id}`"
            accept="image/*"
            class="hidden"
            type="file"
            @change="onFileHandleResult"
          />
        </label>
      </template>
    </div>
    <div class="mb-12 flex justify-end gap-2">
      <div v-if="device.isMobileOrTablet" class="mr-auto">
        <Button class="rounded-md" intent="text" size="sm" @click="onTakeCapture">
          <Icon class="size-4" name="ic:round-photo-camera" />
          Take a Photo
        </Button>
      </div>
      <Button v-if="selectedFile" class="rounded-md" intent="text" size="sm" @click="reset">
        <Icon class="size-4" name="ic:round-remove-circle-outline" />
        Remove
      </Button>
      <Button
        v-if="!files?.length"
        :disabled="isLoadingImage"
        class="rounded-md"
        intent="text"
        size="sm"
        @click="loadExampleImage"
      >
        <template v-if="isLoadingImage">
          Loading
          <Spinner class="size-4" />
        </template>
        <template v-else>
          <Icon name="ic:baseline-upload-file" />
          Load Example
        </template>
      </Button>
    </div>

    <div class="mb-12">
      <MaxColorsInputSlider v-model="maxColors" max="128" min="1" step="1" />
    </div>

    <div class="flex flex-col">
      <Button
        :disabled="!selectedFile || isLoadingNav"
        class="w-full"
        intent="filled"
        @click="onExtractColors"
      >
        <div class="flex items-center justify-center leading-none">
          {{ isLoadingNav ? 'Loading' : `Extract ${maxColors === 1 ? 'Color' : 'Colors'}` }}
        </div>
      </Button>
    </div>
  </div>
</template>

<style>
img.selected {
  view-transition-name: selected;
}

::view-transition-old(selected) {
}

::view-transition-new(selected) {
  object-fit: cover;
  height: 100%;
}

::view-transition-old(selected),
::view-transition-new(selected) {
  mix-blend-mode: normal;
  overflow: clip;
}
</style>
