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

whenever(currentFile, async (file) => {
  isLoading.value = true
  const onLoad = (img: HTMLImageElement) => sourceElement.value = img
  readSourceElement(file, onLoad)
})

whenever(sourceElement, async (source) => {
  const pixels = await pixelsFromImage(source)
  prominentColors.value = prominentColorsFromPixels(pixels, maxColors.value)
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
        <template #chosen="{reset, commit}">
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
            <button :disabled="isLoading" class="filled-button" type="button" @click="commit()">
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
            <h1 class="text-title-lg">Prominent Colors<span
              class="text-on-surface-variant tabular-nums"> ({{ prominentColors.size }})</span></h1>
            <div class="flex flex-wrap gap-2 mt-4">
              <template v-for="([color], index) in prominentColors" :key="index">
                <div :style="{ backgroundColor: hexFromArgb(color) }"
                     class="size-8 rounded-md grid place-items-center relative" />
              </template>
            </div>
          </section>
        </template>
        <template v-if="seedColors">
          <section class="flex flex-col">
            <h1 class="text-title-lg">
              Seed Colors
              <span class="text-on-surface-variant tabular-nums"> ({{ seedColors.length }})</span>
            </h1>
            <div class="grid grid-cols-4 gap-2 mt-4">
              <template v-for="seedColor in seedColors">
                <div
                  :style="{ backgroundColor: hexFromArgb(seedColor) }"
                  class="size-20 md:size-24 rounded-md flex" />
              </template>
            </div>
          </section>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>
