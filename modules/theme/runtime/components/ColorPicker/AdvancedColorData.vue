<script lang="ts" setup>
import chroma from 'chroma-js'

const theColorApiBaseUrl = 'https://www.thecolorapi.com' as const

interface Props {
  color?: chroma.Color
  labels?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  labels: false
})

const { color, labels } = toRefs(props)

function isValid(color: chroma.Color): color is chroma.Color {
  return chroma.valid(color)
}

function getColorAsRgb(color: chroma.Color) {
  return chroma(color).rgb(false)
}

function highlightColorCode(str: string) {
  if (str.startsWith('#')) {
    return `${str.slice(0, 1)}<span class="text-tertiary">${str.slice(1)}</span>`
  }
  return str.replace(/(\d+)/g, '<span class="text-primary">$1</span>')
}

const data = shallowRef<any>()
const error = ref<unknown>()

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
    name: data.value?.name?.value || 'unknown',
    hex: data.value?.hex?.value || 'unknown',
    rgb: data.value?.rgb?.value || 'unknown',
    hsl: data.value?.hsl?.value || 'unknown',
    hsv: data.value?.hsv?.value || 'unknown',
    cmyk: data.value?.cmyk?.value || 'unknown'
  }
})
</script>

<template>
  <div class="relative flex h-[238px] w-full flex-col">
    <div v-if="error" class="text-error">{{ error }}</div>
    <Transition v-else mode="out-in" name="fade">
      <div v-if="isLoading" class="grid size-full place-items-center">
        <Spinner />
      </div>
      <div
        v-else-if="filteredData"
        :class="labels ? 'grid-cols-[48px,1fr]' : 'grid-cols-1'"
        class="grid w-full"
      >
        <template v-for="(value, key) in filteredData" :key="key">
          <div v-if="labels" class="">
            <label
              :class="key === 'name' ? 'capitalize' : 'uppercase'"
              class="flex h-full items-center text-nowrap text-xs italic text-on-surface-variant"
              v-html="highlightColorCode(key)"
            />
          </div>
          <div
            class="group relative flex size-full rounded-md pr-12 hover:bg-surface-bright/50"
          >
            <div
              :class="key === 'name' ? 'text-title-lg font-medium text-primary' : ''"
              class="w-full text-nowrap p-2"
              v-html="highlightColorCode(value)"
            />
            <div
              class="invisible absolute right-0 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:visible"
            >
              <SaveToClipboard :source="value" />
            </div>
          </div>
        </template>
      </div>
    </Transition>
  </div>
</template>

<style scoped></style>
