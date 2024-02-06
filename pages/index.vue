<script lang="ts" setup>
import { hexFromArgb, TonalPalette } from '@material/material-color-utilities'
import { openColorPicker } from '~/modules/dialog/runtime/factory'

const { $dynamicScheme } = useNuxtApp()

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

async function onOpenColorPicker(keyColor: string, initialColor: number) {
  const { data, isCanceled } = await openColorPicker({
    keyColor,
    initialColor,
    onColorChange: (color) => {
      console.log('Color changed to', color, hexFromArgb(color))
    }
  })

  if (isCanceled) {
    console.log('Color picker was canceled')
    return
  }

  if (data) {
    console.log('Color picker returned', data)
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-2xl p-4">
    <section class="mb-2"></section>
  </div>
  <section class="sticky inset-0 top-0 z-10 mb-2 bg-surface">
    <div class="mx-auto flex w-full max-w-2xl justify-center">
      <SelectVariant />
    </div>
  </section>
  <div class="mx-auto w-full max-w-2xl p-4">
    <section class="mb-2">
      <div class="grid grid-cols-2 gap-4">
        <div class="grid h-fit grid-rows-[auto] flex-col">
          <h1 class="mb-2 overflow-hidden overflow-ellipsis text-nowrap capitalize">
            Source Color
          </h1>
          <ColorPreview
            :color="$dynamicScheme.sourceColorArgb"
            class="h-24"
            @click="onOpenColorPicker('sourceColor', $dynamicScheme.sourceColorArgb)"
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
            @click="onOpenColorPicker(key, palette.keyColor.toInt())"
          />
        </div>
      </div>
    </section>
    <section class="mb-2"></section>
  </div>
</template>
