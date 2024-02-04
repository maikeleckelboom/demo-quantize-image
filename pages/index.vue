<script lang="ts" setup>
import KeyColorModel from '~/modules/theme/runtime/components/KeyColorModel.vue'
import { argbFromHex, TonalPalette } from '@material/material-color-utilities'

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
          key: formatKey(key),
          palette
        })
      }
      return acc
    },
    [] as { key: string; palette: TonalPalette }[]
  )
})

function tonalPaletteFromHex(hex: string) {
  return TonalPalette.fromInt(argbFromHex(hex))
}
</script>

<template>
  <header class="fixed left-0 right-0 top-0 z-40 bg-surface-dim py-2">
    <div class="flex w-full justify-center">
      <SelectVariant />
    </div>
  </header>
  <div class="mx-auto mt-[46px] w-full max-w-2xl p-8">
    <section class="mb-2">
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2">
          <PaletteKeyColorPreview :palette="tonalPaletteFromHex(sourceColor)" />
        </div>
        <div v-for="{ key, palette } in palettes" :key="key" class="flex flex-col">
          <h1 class="mb-2 capitalize">
            {{ key }}
          </h1>
          <PaletteKeyColorPreview :palette="palette" />
        </div>
      </div>
    </section>
    <section class="mb-6">
      <KeyColorModel />
    </section>
  </div>
  <div class="p-8">
    <Glossary />
  </div>
</template>

<style lang="postcss">
.custom-grid {
}
</style>
