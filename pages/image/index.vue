<script lang="ts" setup>
const store = useFilesStore()
const { files, selectedFile } = storeToRefs(store)
const { reset } = store

function onDrop(droppedFiles: File[]) {
  files.value = droppedFiles
}

const maxColors = ref<number>(128)

async function onExtractColors() {
  if (!selectedFile.value) return
  navigateTo({
    path: `/quantize/${selectedFile.value.name}`,
    query: { maxColors: maxColors.value }
  })
}

/* Example Images */
const images = [
  '/img/purplish-landscape.jpg',
  '/img/firewatch-fox.jpg',
  '/img/islands.jpg',
  '/img/supernova.jpg'
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

async function setExampleImage() {
  const exampleImage = images[Math.floor(Math.random() * images.length)]
  const file = await fileFromImagePath(exampleImage)
  files.value = [file]
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-xl flex-col p-4">
    <div class="mb-8">
      <h1 class="mb-2 text-headline-sm md:mb-4 md:text-headline-lg md:leading-snug">
        Upload an image to generate color palettes
      </h1>
      <p class="text-body-sm text-on-surface-variant">
        The image is digitally analyzed, a single color is selected as the source color, and tones are chosen
        and assigned to each color role.
      </p>
    </div>
    <div class="mb-4 h-64 overflow-hidden">
      <FilePreview v-if="selectedFile" id="vt-source-element" :url="store.fileObjectUrl" />
      <FileDropZone v-else @drop="onDrop" />
    </div>

    <template v-if="selectedFile">
      <div class="my-4">
        <fieldset>
          <div class="flex flex-col justify-between">
            <label class="mb-4 flex flex-nowrap items-center gap-x-2 text-label-md" for="maxColors"
              >Max Colors
              <span class="text-xs tabular-nums text-on-surface-variant">(1-128)</span>
              <Tooltip class="justify-self-end">
                <button class="flex items-center justify-center">
                  <Icon class="ml-0.5 h-4 w-4 text-on-surface-variant" name="ic:baseline-info" />
                </button>
                <template #content>The maximum number of colors to generate from the image.</template>
              </Tooltip>
            </label>
            <div class="">
              <LabeledInputSlider v-model="maxColors" contained="true" max="128" min="1" step="1" />
            </div>
          </div>
        </fieldset>
      </div>
    </template>

    <!-- the rest of the template -->
    <div class="my-4 flex flex-col">
      <Buttons class="justify-end">
        <Button v-if="selectedFile" intent="text" @click="reset">Reset</Button>
        <div v-else class="flex justify-end">
          <Button intent="outlined" size="sm" @click="setExampleImage"> Load Example Image</Button>
        </div>
        <Button :disabled="!selectedFile" @click="onExtractColors">
          {{ 'Extract colors' }}
        </Button>
      </Buttons>
    </div>
  </div>
</template>

<style scoped>
#vt-source-element {
  view-transition-name: source-img;
}

::view-transition-old(source-img),
::view-transition-new(source-img) {
}

::view-transition-image-pair(source-img) {
  transition: ease all 200ms;
}
</style>
