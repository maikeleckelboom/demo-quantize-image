<script lang="ts" setup>
import chroma from 'chroma-js'
import { z } from 'zod'

const theColorApiBaseUrl = 'https://www.thecolorapi.com' as const

interface Props {
  color?: chroma.Color
}

const props = defineProps<Props>()
const { color } = toRefs(props)

const data = shallowRef<any>()
const exception = ref<unknown>()

function isValid(color: chroma.Color): color is chroma.Color {
  return chroma.valid(color)
}

function getColorAsRgb(color: chroma.Color) {
  return chroma(color).alpha(1).rgb()
}

const isLoading = ref<boolean>(false)

const debounce = ref<number>(180)

watchDebounced(
  color,
  async (v) => {
    if (!v || (v && !isValid(v))) return
    isLoading.value = true
    try {
      data.value = await $fetch(`${theColorApiBaseUrl}/id?rgb=${getColorAsRgb(v)}`)
    } catch (err) {
      if (err instanceof z.ZodError) {
        exception.value = err.issues
        return
      }
      exception.value = err
    } finally {
      isLoading.value = false
    }
  },
  { deep: true, immediate: true, debounce }
)

const filteredData = computed(() => {
  if (!data.value) return
  return {
    name: data.value.name.value,
    hex: data.value.hex.value,
    rgb: data.value.rgb.value,
    hsl: data.value.hsl.value,
    hsv: data.value.hsv.value,
    cmyk: data.value.cmyk.value
  }
})
</script>

<template>
  <div class="relative flex h-fit flex-col gap-y-3 py-3">
    <div v-if="isLoading" class="absolute inset-0 grid place-items-center bg-surface-dim">
      <p class="text-headline-sm text-on-surface">Loading...</p>
    </div>
    <JsonPretty v-if="exception" :data="exception" />
    <JsonPretty v-else :data="filteredData" :deep="1" />
  </div>
</template>

<style scoped></style>
