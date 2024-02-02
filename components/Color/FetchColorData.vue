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

watchDebounced(
  color,
  async (v) => {
    if (!v || (v && !isValid(v))) return
    try {
      data.value = await $fetch(`${theColorApiBaseUrl}/id?rgb=${getColorAsRgb(v)}`)
    } catch (err) {
      if (err instanceof z.ZodError) {
        exception.value = err.issues
        return
      }
      exception.value = err
    }
  },
  { deep: true, immediate: true, debounce: 500 }
)
</script>

<template>
  <div>
    <pre v-if="exception">{{ exception }}</pre>
    <pre>{{ data }}</pre>
  </div>
</template>

<style scoped></style>
