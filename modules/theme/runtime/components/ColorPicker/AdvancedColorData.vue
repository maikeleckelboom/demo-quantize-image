<script lang="ts" setup>
import chroma from 'chroma-js'
import { z } from 'zod'
import Spinner from '~/components/Spinner.vue'

const theColorApiBaseUrl = 'https://www.thecolorapi.com' as const

interface Props {
  color?: chroma.Color
  labels?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  labels: false
})

const { color, labels } = toRefs(props)

const data = shallowRef<any>()
const error = ref<unknown>()

function isValid(color: chroma.Color): color is chroma.Color {
  return chroma.valid(color)
}

function getColorAsRgb(color: chroma.Color) {
  return chroma(color).rgb()
}

const isLoading = ref<boolean>(false)

const debounce = ref<number>(300)

watchDebounced(
  color,
  async (v) => {
    if (!v || (v && !isValid(v))) return
    isLoading.value = true
    try {
      data.value = await $fetch(`${theColorApiBaseUrl}/id?rgb=${getColorAsRgb(v)}`)
    } catch (err) {
      if (err instanceof z.ZodError) {
        error.value = err.issues
        return
      }
      error.value = err
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
    return `${str.slice(0, 1)}<span class="text-tertiary">${str.slice(1)}</span>`
  }
  return str.replace(/(\d+)/g, '<span class="text-primary">$1</span>')
}
</script>

<template>
  <div class="relative flex h-[212px] w-full flex-col">
    <template v-if="error">
      <pre class="text-error">{{ error }}</pre>
    </template>
    <template v-else-if="isLoading">
      <div class="grid size-full place-items-center">
        <Spinner />
      </div>
    </template>
    <template v-else>
      <div
        v-if="filteredData"
        :class="{
          'grid-cols-[auto,1fr]': labels
        }"
        class="grid"
      >
        <template v-for="(value, key) in filteredData" :key="key">
          <div v-if="labels" class="p-1">
            <label
              :class="{
                uppercase: key !== 'name',
                capitalize: key === 'name'
              }"
              class="flex items-center text-nowrap p-1 italic text-on-surface-variant"
              v-html="highlightColorCode(key)"
            />
          </div>

          <div
            class="group relative flex size-full rounded-md p-1 pr-12 hover:bg-surface-bright/50"
          >
            <div
              :class="{
                'text-title-md font-medium text-primary': key === 'name'
              }"
              class="w-full text-nowrap p-1"
              v-html="highlightColorCode(value)"
            />
            <div
              class="invisible absolute right-0 top-1/2 -translate-x-1/4 -translate-y-1/2 group-hover:visible"
            >
              <SaveToClipboard :source="value" />
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped></style>
