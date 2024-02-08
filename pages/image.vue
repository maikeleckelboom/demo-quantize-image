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

function loadExampleImage() {
  if (import.meta.server) return
}

const sourceElement = ref<HTMLImageElement | null>(null)

const seedColors = ref<number[] | null>(null)
const prominentColors = ref<Map<number, number> | null>(null)

const isLoading = ref<boolean>(false)

const currentFile = ref<File | null>(null)

function readSourceElement(file: File, onLoad: (img: HTMLImageElement) => void) {
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

function extractColors() {
  if (!selectedFile.value) return
  isLoading.value = true
  const onLoad = (img: HTMLImageElement) => (sourceElement.value = img)
  readSourceElement(selectedFile.value, onLoad)
}

function reset() {
  resetFiles()
  resetColors()
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
    <div v-if="!selectedFile" class="mb-4 flex justify-end">
      <Button intent="outlined" size="sm" @click="loadExampleImage"> Load Example Image</Button>
    </div>

    <template v-if="selectedFile">
      <div class="mb-4">
        <fieldset>
          <div class="flex flex-col justify-between">
            <label class="mb-4 flex flex-nowrap gap-x-2 text-label-md" for="maxColors">
              Max Colors
              <Tooltip class="justify-self-end">
                <button>
                  <Icon class="h-4 w-4 text-on-surface-variant" name="ic:baseline-info" />
                </button>
                <template #content> The maximum number of colors to generate from the image.</template>
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
    <div class="flex flex-col">
      <Buttons class="justify-end">
        <Button v-if="selectedFile" intent="text" @click="reset">Reset</Button>
        <Button :disabled="!selectedFile || isLoading" @click="extractColors">
          {{ isLoading ? 'Extracting colors ...' : 'Extract colors' }}
        </Button>
      </Buttons>
    </div>

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
</template>

<style scoped></style>
