<script lang="ts" setup>
import { hexFromArgb, TonalPalette } from '@material/material-color-utilities'

const { $dynamicScheme } = useNuxtApp()
const { sourceColor, contrastLevel } = useThemeConfig()

const palettes = computed(() =>
  Object.keys($dynamicScheme.value).reduce(
    (acc, key) => {
      const palette = $dynamicScheme.value[key as keyof typeof $dynamicScheme.value]
      if (palette instanceof TonalPalette) {
        acc.push({
          key,
          palette
        })
      }
      return acc
    },
    [] as { key: string; palette: TonalPalette }[]
  )
)

function removePaletteFromKey(key: string) {
  return key
    .split(/(?=[A-Z])/)
    .filter((s) => s !== 'palette' && s !== 'key' && s !== 'color')
    .map((s) => s.toLowerCase())
    .join(' ')
}

const color = shallowReactive({
  key: 'sourceColor',
  value: sourceColor.value
})

function setColor(key: string, value: string) {
  color.key = key
  color.value = value
}

const selectedColor = computed({
  get: () => color,
  set: (value) => {
    setColor(value.key, value.value)
  }
})
</script>

<template>
  <section class="sticky inset-0 top-0 z-10 mb-2 bg-surface">
    <div class="mx-auto flex w-full max-w-2xl justify-center">
      <SelectVariant />
    </div>
  </section>
  <div class="mx-auto w-full max-w-2xl p-4">
    <section class="mb-2">
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2 grid h-fit grid-rows-[auto,1fr] flex-col">
          <h1 class="mb-2 overflow-hidden overflow-ellipsis text-nowrap capitalize">
            Source Color
          </h1>
          <ColorPreview
            :color="$dynamicScheme.sourceColorArgb"
            class="h-32"
            @click="setColor('sourceColor', hexFromArgb($dynamicScheme.sourceColorArgb))"
          />
        </div>
        <div
          v-for="{ key, palette } in palettes"
          :key="key"
          class="grid h-fit grid-rows-[auto,1fr] flex-col"
        >
          <h1 class="mb-2 overflow-hidden overflow-ellipsis text-nowrap capitalize">
            {{ removePaletteFromKey(key) }}
          </h1>
          <ColorPreview
            :color="palette.keyColor.toInt()"
            class="h-24"
            @click="setColor(key, hexFromArgb(palette.keyColor.toInt()))"
          />
        </div>
      </div>
    </section>
    <section class="mb-2">
      <KeyColorModel
        v-if="selectedColor"
        v-model="selectedColor.value"
        :label="selectedColor.key"
      />
    </section>
  </div>
</template>
