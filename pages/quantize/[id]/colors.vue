<script lang="ts" setup>
import { hexFromArgb } from '@material/material-color-utilities'

const colorStore = useColorsStore()
const { prominentColors, seedColors } = storeToRefs(colorStore)
const { setProminentColors, setSeedColors } = colorStore

if (!prominentColors.value || !seedColors.value) {
  navigateTo('/quantize')
}
</script>

<template>
  <div class="mx-auto w-full max-w-xl p-4">
    <h1 class="mb-2">Colors</h1>
    <div class="flex flex-wrap gap-1">
      <div
        v-for="[color] in prominentColors"
        :key="color"
        :style="{ backgroundColor: hexFromArgb(color) }"
        class="min-h-12 min-w-12 rounded-full"
      >
        <!--{{ color }}-->
      </div>
      <div
        v-for="color in seedColors"
        :key="color"
        :style="{ backgroundColor: hexFromArgb(color) }"
        class="min-h-12 min-w-12 rounded-full"
      >
        <!--{{ color }}-->
      </div>
    </div>
  </div>
</template>

<style scoped></style>
