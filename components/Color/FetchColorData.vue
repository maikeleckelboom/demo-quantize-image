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

function highlightColorCode(str: string) {
  if (str.startsWith('#')) {
    return `${str.slice(0, 1)}<span class="text-primary">${str.slice(1)}</span>`
  }
  return str.replace(/(\d+)/g, '<span class="text-primary">$1</span>')
}
</script>

<template>
  <div class="relative flex h-fit w-fit flex-col gap-y-1">
    <JsonPretty v-if="exception" :data="exception" :virtual="true" />
    <div v-else-if="filteredData">
      <fieldset v-for="(value, key) in filteredData" :key="key" class="group">
        <div
          class="relative flex size-full rounded-md p-2 pr-12 hover:bg-surface-bright/50"
        >
          <div class="w-full text-nowrap" v-html="highlightColorCode(value)" />
          <div
            class="invisible absolute right-0 top-1/2 -translate-x-1/4 -translate-y-1/2 group-hover:visible"
          >
            <SaveToClipboard :source="value" />
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<style scoped></style>
