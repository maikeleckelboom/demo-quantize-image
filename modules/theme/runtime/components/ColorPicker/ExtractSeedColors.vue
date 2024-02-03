<script lang="ts" setup>
import { hexFromArgb, Score } from '@material/material-color-utilities'
import Button from '~/modules/button/runtime/components/Button.vue'

const sourceElement = ref<HTMLImageElement | null>(null)

const seedColors = ref<number[] | null>(null)
const prominentColors = ref<Map<number, number> | null>(null)

const isLoading = ref<boolean>(false)

const currentFile = ref<File | null>(null)

const onFileCommit = (file: File) => {
  currentFile.value = file
}

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

whenever(currentFile, async (file: File) => {
  isLoading.value = true
  const onLoad = (img: HTMLImageElement) => (sourceElement.value = img)
  readSourceElement(file, onLoad)
})

whenever(sourceElement, async (source: HTMLImageElement) => {
  const pixels = await pixelsFromImage(source)
  prominentColors.value = prominentColorsFromPixels(pixels, Math.round(maxColors.value))
  seedColors.value = Score.score(prominentColors.value)
  isLoading.value = false
})

function reset() {
  seedColors.value = null
  prominentColors.value = null
}
</script>

<template>
  <div class="flex flex-col gap-y-8">
    <section>
      <FileInput class="mb-4" @commit="onFileCommit" @reset="reset">
        <template #chosen="{ reset, commit }">
          <RangeInputField
            v-model.number="maxColors"
            class="mb-4"
            label="Max colors (1-128)"
            max="128"
            min="1"
            round="0"
            step="1"
          />
          <div class="flex gap-4">
            <button
              :disabled="isLoading"
              class="filled-button"
              type="button"
              @click="commit()"
            >
              {{ isLoading ? 'Extracting colors ...' : 'Extract colors' }}
            </button>
          </div>
        </template>
      </FileInput>
    </section>
    <section>
      <div class="flex flex-col gap-4">
        <template v-if="prominentColors">
          <section>
            <h1 class="text-title-lg">
              Prominent Colors
              <span class="tabular-nums text-on-surface-variant">
                ({{ prominentColors.size }})
              </span>
            </h1>
            <div class="mt-4 flex flex-wrap gap-2">
              <template v-for="([color], index) in prominentColors" :key="index">
                <div
                  :style="{ backgroundColor: hexFromArgb(color) }"
                  class="relative grid size-8 place-items-center rounded-md"
                />
              </template>
            </div>
          </section>
        </template>
        <template v-if="seedColors">
          <section class="flex flex-col">
            <h1 class="text-title-lg">
              Suitable Seed Colors
              <span class="tabular-nums text-on-surface-variant">
                ({{ seedColors.length }})</span
              >
            </h1>
            <div class="mt-4 grid grid-cols-4 gap-2">
              <template v-for="seedColor in seedColors">
                <div
                  :style="{ backgroundColor: hexFromArgb(seedColor) }"
                  class="flex size-20 rounded-md md:size-24"
                />
              </template>
            </div>
          </section>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
