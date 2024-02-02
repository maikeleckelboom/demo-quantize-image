<script lang="ts" setup>
import { hexFromArgb, Score } from '@material/material-color-utilities'

const wallpapers = [
  '/img/supernova.jpg',
  '/img/firewatch-fox.jpg',
  /*
    '/img/mountains-midnight.jpg',
  */
  '/img/islands.jpg',
  '/img/purplish-landscape.jpg' /*
   '/img/flying-bird-landscape.jpg'*/
]

const wallpapersRef = useTemplateRefsList<HTMLImageElement>()

const currentWallpaper = useCookie('currentWallpaper')

const setWallpaper = (wallpaper: string) => {
  currentWallpaper.value = wallpaper
}

const prominentColors = ref<Map<number, number>>()
const seedColors = ref<number[]>([])

async function apply() {
  if (!currentWallpaper.value) return
  const wallpaperEl = wallpapersRef.value[wallpapers.indexOf(currentWallpaper.value)]
  if (!wallpaperEl) return
  const pixels = await pixelsFromImage(wallpaperEl)
  prominentColors.value = prominentColorsFromPixels(pixels)
  seedColors.value = Score.score(prominentColors.value)
}
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <div v-for="wallpaper in wallpapers" :key="wallpaper" class="relative">
      <img
        :ref="wallpapersRef.set"
        :alt="wallpaper"
        :class="[currentWallpaper === wallpaper ? 'border-primary' : 'border-transparent']"
        :src="wallpaper"
        class="aspect-video rounded-md border-2"
        @click="() => setWallpaper(wallpaper)"
      />
      <div
        v-if="currentWallpaper === wallpaper"
        class="absolute left-1/2 top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-outline-variant bg-primary-container/80 text-on-primary-container"
      >
        <Icon class="h-6 w-6" name="ic:round-check" />
      </div>
    </div>
    <!-- Apply -->
    <div class="col-span-full">
      <div class="flex justify-end">
        <button :disabled="currentWallpaper === null" class="outlined-button" @click="apply">Quantize</button>
      </div>
    </div>
    <div class="col-span-full">
      <h1 class="mb-2 text-headline-sm">Prominent Colors</h1>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="[color, count] in prominentColors"
          :key="count"
          :style="{ background: hexFromArgb(color) }"
          class="aspect-video min-w-12 rounded-md"
        ></div>
      </div>
      <div class="flex gap-4">
        <div
          v-for="color in seedColors"
          :key="color"
          :style="{ background: hexFromArgb(color) }"
          class="aspect-video min-w-24 rounded-md"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
