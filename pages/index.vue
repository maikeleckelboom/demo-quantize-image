<script lang="ts" setup>
import { TonalPalette } from '@material/material-color-utilities'
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
    keyColor, // name
    initialColor, // color
    onColorChange: (color) => {
      //
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

function onFabClick() {
  console.log('FAB clicked')
}
</script>

<template>
  <div class="mx-auto w-full max-w-xl p-4">
    <section class="mb-2"></section>
  </div>
  <!--  <section class="sticky inset-0 top-0 z-10 mb-2 bg-surface">
      <div class="mx-auto flex w-full max-w-xl justify-center">
        <SelectVariant />
      </div>
    </section>-->
  <div class="mx-auto w-full max-w-xl p-4">
    <div class="flex flex-wrap gap-4">
      <div class="size-fit">
        <h1 class="mb-2 overflow-hidden overflow-ellipsis text-nowrap capitalize">Source Color</h1>
        <ColorPreview
          :color="$dynamicScheme.sourceColorArgb"
          class="h-12"
          @click="onOpenColorPicker('sourceColor', $dynamicScheme.sourceColorArgb)"
        />
      </div>
      <div v-for="{ key, palette } in palettes" :key="key">
        <h1 class="mb-2 overflow-hidden overflow-ellipsis text-nowrap capitalize">
          {{ removePaletteFromKey(key) }}
        </h1>
        <ColorPreview
          :color="palette.keyColor.toInt()"
          class="h-12"
          @click="onOpenColorPicker(key, palette.keyColor.toInt())"
        />
      </div>
    </div>
    <section class="mb-2"></section>
    <Glossary />
  </div>
  <div class="pointer-events-none fixed inset-x-0 bottom-[92px]">
    <div class="mx-auto flex size-full max-w-xl justify-end px-4">
      <Button
        class="pointer-events-auto"
        intent="extended-fab"
        size="lg"
        variant="primary"
        @click="onFabClick"
      >
        <Icon name="ic:round-add" />
      </Button>
    </div>
  </div>
</template>
