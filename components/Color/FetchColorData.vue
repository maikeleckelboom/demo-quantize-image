<script lang="ts" setup>
import chroma from 'chroma-js'


/**
 * /id?hex=ffa or /id?hex=00ffa6
 * /id?rgb=rgb(255,0,0) or /id?rgb=20,43,55
 * Same goes for cmyk, hsl, and hsv formats
 * Every color object returned by the API
 * Is named from a matched dataset of over 2000 names+colors
 * –––
 * // https://www.thecolorapi.com/id?hex=24B1E0
 * // https://www.thecolorapi.com/id?rgb=39,177,224
 * // https://www.thecolorapi.com/id?rgb=rgb(39,177,224)
 */

type SupportedColorFormat = 'hex' | 'rgb' | 'cmyk' | 'hsl' | 'hsv'

const theColorApiBaseUrl = 'https://www.thecolorapi.com' as const

interface Props {
  color?: chroma.Color
}

const props = defineProps<Props>()

const { color } = toRefs(props)

function getColorAsRgb(color: chroma.Color) {
  return chroma(color).alpha(1).rgb()
}

const data = shallowRef<Record<string, unknown> | null>(null)

whenever(color, async (v) => {
  const rgb = getColorAsRgb(v)
  const url = `${theColorApiBaseUrl}/id?rgb=${rgb}`
  const response = await fetch(url)
  data.value = await response.json()
})

watch(data, (v) => {
  console.log(v)
})
</script>

<template>
  <div>
    <pre>{{ color }}</pre>
  </div>
</template>

<style scoped>

</style>
