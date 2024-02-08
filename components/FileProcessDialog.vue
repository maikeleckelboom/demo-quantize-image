<script lang="ts" setup>
import type { DialogComponent } from '#components'
import { hexFromArgb, Score } from '@material/material-color-utilities'
import type { FileProcessOptions } from '~/modules/dialog/runtime/factory'

const props = withDefaults(defineProps<FileProcessOptions>(), {
  maxColors: 128
})

const { file, maxColors } = toRefs(props)

const { close } = useDialogs()
const { isTop } = useStack()

function exit() {
  if (!isTop.value) return
  close(null)
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

whenever(sourceElement, async (source: HTMLImageElement) => {
  const pixels = await pixelsFromImage(source)
  prominentColors.value = prominentColorsFromPixels(pixels, toValue(maxColors.value))
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
    readAndLoadSourceImage(file.value, (img: HTMLImageElement) => {
      sourceElement.value = img
    })
  }, 100)
}

onMounted(() => {
  beginColorExtract()
})
</script>

<template>
  <DialogBackdrop>
    <DialogComponent ref="root" @close="exit">
      <template #header>
        <h1 class="text-headline-sm font-medium capitalize md:text-headline-md"></h1>
      </template>
      <template v-if="isLoading">
        <div class="grid size-full">Processing...</div>
      </template>
      <template v-else>
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
      </template>
      <div class="mt-6">
        <Button intent="text" @click="exit">Cancel</Button>
      </div>

      <template #footer></template>
    </DialogComponent>
  </DialogBackdrop>
</template>

<style scoped></style>
