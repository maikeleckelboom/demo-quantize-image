<script lang="ts" setup>
import { hexFromArgb, Score } from '@material/material-color-utilities'

const files = ref<File[]>([])
const { selectedFile } = useFileSelection(files)

function onDrop(droppedFiles: File[]) {
  files.value = droppedFiles
}

function resetFiles() {
  files.value = []
}

const sourceElement = ref<HTMLImageElement | null>(null)

const seedColors = ref<number[] | null>(null)
const prominentColors = ref<Map<number, number> | null>(null)

const isLoading = ref<boolean>(false)

function readAndLoadSourceImage(file: File, onLoad: (img: HTMLImageElement) => void) {
  const reader = new FileReader()
  const img = new Image()
  reader.onload = (e) => {
    img.onload = () => {
      onLoad(img)
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const maxColors = ref<number>(128)

whenever(sourceElement, async (source: HTMLImageElement) => {
  const pixels = await pixelsFromImage(source)
  prominentColors.value = prominentColorsFromPixels(pixels, maxColors.value)
  seedColors.value = Score.score(prominentColors.value)
  isLoading.value = false
})

function resetColors() {
  seedColors.value = null
  prominentColors.value = null
}

function beginColorExtract() {
  isLoading.value = true
  setTimeout(() => {
    if (!selectedFile.value) return
    readAndLoadSourceImage(selectedFile.value, (img: HTMLImageElement) => {
      sourceElement.value = img
    })
  }, 100)
}

async function onExtractColors() {
  if (!selectedFile.value) return
  beginColorExtract()
  // await openFileProcessDialog({
  //   file: selectedFile.value
  // })
}

function reset() {
  resetFiles()
  resetColors()
}

/* Example Images */
const images = [
  '/img/purplish-landscape.jpg',
  '/img/firewatch-fox.jpg',
  '/img/islands.jpg'
  // '/img/supernova.jpg'
] as const

const blobFromUrl = async (url: string) => {
  const response = await fetch(url)
  return await response.blob()
}

async function setExampleImage() {
  const exampleImage = images[Math.floor(Math.random() * images.length)]
  const blob = await blobFromUrl(exampleImage)
  const file = new File([blob], 'example-image.jpg', {
    type: exampleImage.slice(exampleImage.lastIndexOf('.'))
  })
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
      <FilePreview v-if="selectedFile" :file="selectedFile" />
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
        <Button :disabled="!selectedFile || isLoading" @click="onExtractColors">
          {{ isLoading ? 'Extracting colors ...' : 'Extract colors' }}
        </Button>
      </Buttons>
    </div>
    <div class="flex flex-col gap-8">
      <section v-if="prominentColors">
        <h1 class="text-title-lg">
          Prominent Colors
          <span class="tabular-nums text-on-surface-variant"> ({{ prominentColors.size }}) </span>
        </h1>
        <div class="mt-4 flex flex-wrap gap-2">
          <template v-for="([color, count], index) in prominentColors" :key="index">
            <div
              :style="{ backgroundColor: hexFromArgb(color) }"
              class="relative grid size-8 place-items-center rounded-md"
            />
          </template>
        </div>
      </section>
      <section v-if="seedColors">
        <h1 class="text-title-lg">
          Suitable Colors
          <span class="tabular-nums text-on-surface-variant"> ({{ seedColors.length }}) </span>
        </h1>
        <div class="mt-4 flex flex-nowrap gap-4">
          <template v-for="seedColor in seedColors">
            <div
              :style="{ backgroundColor: hexFromArgb(seedColor) }"
              class="flex size-20 rounded-md md:size-24"
            />
          </template>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped></style>
