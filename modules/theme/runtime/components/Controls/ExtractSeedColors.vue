<script lang="ts" setup>

import { hexFromArgb } from '@material/material-color-utilities'

const sourceElement = ref<HTMLImageElement | null>(null)

const onFileCommit = (file: File) => {
  currentFile.value = file
}

const localSeedColors = ref<number[] | null>(null)

whenever(sourceElement, async (source) => {
  localSeedColors.value = await seedColorsFromImage(source)
})

watch(localSeedColors, (seedColors) => {
  if (!seedColors) return

  console.log('seedColors', seedColors)
})

const currentFile = ref<File | null>(null)

whenever(currentFile, async (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      sourceElement.value = img
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
})
</script>

<template>
  <div class="flex flex-col">
    <FileInput @commit="onFileCommit" />
    <section class="flex flex-col">
      <div class="grid grid-cols-4 mt-4">
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
