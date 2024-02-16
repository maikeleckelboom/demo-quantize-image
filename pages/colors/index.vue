<script lang="ts" setup>
import { groupSchemeByKeyAndPalette } from '~/modules/theme/runtime/utils/color'

const { $dynamicScheme } = useNuxtApp()

const palettes = computed(() => groupSchemeByKeyAndPalette($dynamicScheme.value))

function formatKey(key: string) {
  return key
    .split(/(?=[A-Z])/)
    .filter((s) => s !== 'palette' && s !== 'key' && s !== 'color')
    .map((s) => s.toLowerCase())
    .join(' ')
}

async function navigateToKey(key: string, initialValue: number) {
  if (!key) return
  const next = () =>
    navigateTo({
      path: `/colors/${key}`
    })

  if (!document?.startViewTransition) {
    await next()
    return
  }

  document.startViewTransition(async () => {
    await next()
  })
}
</script>

<template>
  <div class="mx-auto w-full max-w-xl p-4">
    <div class="grid grid-cols-2 gap-4">
      <div class="col-span-2">
        <h1 class="mb-2 overflow-hidden overflow-ellipsis text-nowrap capitalize">Source Color</h1>
        <ColorPreview
          :color="$dynamicScheme.sourceColorArgb"
          class="h-12"
          @click="navigateToKey('sourceColor', $dynamicScheme.sourceColorArgb)"
        />
      </div>
      <div v-for="{ key, palette } in palettes" :key="key">
        <h1 class="mb-2 overflow-hidden overflow-ellipsis text-nowrap text-title-lg capitalize">
          {{ formatKey(key) }}
        </h1>
        <ColorPreview
          :color="palette.keyColor.toInt()"
          class="h-12"
          @click="navigateToKey(key, palette.keyColor.toInt())"
        />
      </div>
    </div>
  </div>
</template>
