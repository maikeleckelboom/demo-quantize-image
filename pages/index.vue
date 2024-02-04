<script lang="ts" setup>
import KeyColorModel from '~/modules/theme/runtime/components/KeyColorModel.vue'
import {
  argbFromHex,
  hexFromArgb,
  TonalPalette
} from '@material/material-color-utilities'

const { $dynamicScheme } = useNuxtApp()
const { sourceColor } = useThemeConfig()

function formatKey(key: string) {
  return key
    .split(/(?=[A-Z])/)
    .map((s) => s.toLowerCase())
    .filter((s) => s !== 'palette' && s !== 'key' && s !== 'color')
    .join(' ')
}

const palettes = computed(() => {
  return Object.keys($dynamicScheme.value).reduce(
    (acc, key) => {
      const palette = $dynamicScheme.value[key as keyof typeof $dynamicScheme.value]
      if (palette instanceof TonalPalette) {
        acc.push({
          name: formatKey(key),
          palette
        })
      }
      return acc
    },
    [] as { name: string; palette: TonalPalette }[]
  )
})

function tonalPaletteFromHex(hex: string) {
  return TonalPalette.fromInt(argbFromHex(hex))
}

const selectedPalette = ref<TonalPalette>(tonalPaletteFromHex(sourceColor.value))

function onSelectPalette(palette: TonalPalette) {
  selectedPalette.value = palette
}

function findPaletteInDynScheme() {
  let s = unref($dynamicScheme)
  for (let key in s) {
    if (s[key as keyof typeof s] instanceof TonalPalette) {
      console.log('key', key)
      console.log('palette', s[key as keyof typeof s])
    }
  }
}

const selectedPaletteModel = computed({
  get: () => hexFromArgb(selectedPalette.value.keyColor.toInt() || 0),
  set: (value: string) => {
    selectedPalette.value = tonalPaletteFromHex(value)
  }
})
</script>

<template>
  <header class="fixed left-0 right-0 top-0 z-40 bg-surface-dim">
    <div class="flex w-full justify-center">
      <SelectVariant />
    </div>
  </header>
  {{ selectedPaletteKey }}
  <div class="mx-auto mt-[74px] w-full max-w-2xl p-3">
    <section class="mb-2">
      <div class="grid grid-cols-3 gap-4">
        <div v-for="{ name, palette } in palettes" :key="name" class="flex flex-col">
          <h1 class="mb-2 capitalize">
            {{ name }}
          </h1>
          <PaletteKeyColorPreview :palette="palette" @click="onSelectPalette(palette)" />
        </div>
      </div>
    </section>
    <section v-if="selectedPaletteModel" class="mb-6">
      <KeyColorModel v-model="selectedPaletteModel"></KeyColorModel>
    </section>
  </div>
</template>

<style lang="postcss">
.custom-grid {
}
</style>
