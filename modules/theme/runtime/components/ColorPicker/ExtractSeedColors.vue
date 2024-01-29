<script lang="ts" setup>

import { hexFromArgb, Score } from '@material/material-color-utilities'
import Button from '~/modules/button/runtime/Button.vue'

const sourceElement = ref<HTMLImageElement | null>(null)

const localSeedColors = ref<number[] | null>(null)
const localProminentColors = ref<Map<number, number> | null>(null)

const isLoading = ref<boolean>(false)

whenever(sourceElement, async (source) => {
  const pixels = await pixelsFromImage(source)
  localProminentColors.value = prominentColorsFromPixels(pixels)
  localSeedColors.value = Score.score(localProminentColors.value)
  isLoading.value = false
})

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
  return img
}

whenever(currentFile, async (file) => {
  isLoading.value = true
  const onLoad = (img: HTMLImageElement) => {
    sourceElement.value = img
  }

  const sourceEl = readSourceElement(file, onLoad)

  console.log('sourceEl', sourceEl)
})

function onReset(callback: () => void) {
  callback()
  localSeedColors.value = null
  localProminentColors.value = null
}
</script>

<template>
  <div class="flex flex-col">
    <FileInput class="mb-4" @commit="onFileCommit">
      <template #actions="{open, count,reset, commit}">
        <button class="outlined-button" type="button" @click="open">
          Choose another image
        </button>
        <button class="outlined-button" type="button" @click="onReset(reset)">
          Reset
        </button>
        <button :disabled="isLoading" class="filled-button" type="button" @click="commit()">
          {{ isLoading ? 'Extracting colors ...' : 'Extract colors' }}
        </button>
      </template>
    </FileInput>
    <div class="flex flex-col gap-4">
      <template v-if="localProminentColors">
        <div class="flex flex-wrap gap-2">
          <template v-for="([color, count], index) in localProminentColors" :key="index">
            <div :style="{ backgroundColor: hexFromArgb(color) }" class="size-8 rounded-md flex" />
          </template>
        </div>
      </template>
    </div>
    <section class="flex flex-col">
      <div class="flex flex-wrap gap-2 mt-4">
        <template v-for="seedColor in localSeedColors">
          <div
            :style="{ backgroundColor: hexFromArgb(seedColor) }"
            class="size-24 rounded-md flex"
          />
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>
