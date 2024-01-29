<script lang="ts" setup>
import { hexFromArgb, rgbaFromArgb, type TonalPalette } from '@material/material-color-utilities'
import chroma from 'chroma-js'
import SaveToClipboard from '~/modules/theme/runtime/components/SaveToClipboard.vue'

const props = defineProps<{
  palette: TonalPalette
}>()

const { palette } = toRefs(props)

const keyColor = computed(() => {
  return palette.value.keyColor
})

const keyColorHex = computed(() => {
  if (!keyColor.value) return ''
  return hexFromArgb(keyColor.value.toInt())
})

const keyColorRgba = computed(() => {
  if (!keyColor.value) return ''
  return rgbaFromArgb(keyColor.value.toInt())
})

const keyColorHsl = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).hsl()
})

const keyColorLab = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).lab()
})

const keyColorLch = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).lch()
})

const keyColorRgb = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).rgb()
})

const keyColorHsv = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).hsv()
})

const keyColorHsi = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).hsi()
})

const keyColorCmyk = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).cmyk()
})

const keyColorTemperature = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).temperature()
})

const keyColorLuminance = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).luminance()
})

const keyColorAlpha = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).alpha()
})

const keyColorName = computed(() => {
  if (!keyColor.value) return
  const name = chroma(hexFromArgb(keyColor.value.toInt())).name()
  if (name.startsWith('#')) return
  return name
})

const paletteKeyColorConverts = computed(() => {
  const colorName = keyColorName.value ? `(${keyColorName.value})` : ''
  return {
    hex: `${keyColorHex.value} ${colorName}`,
    rgb: keyColorRgb.value,
    hsl: keyColorHsl.value,
    hsv: keyColorHsv.value,
    hsi: keyColorHsi.value,
    lab: keyColorLab.value,
    lch: keyColorLch.value,
    cmyk: keyColorCmyk.value,
    temperature: keyColorTemperature.value,
    luminance: keyColorLuminance.value,
    alpha: keyColorAlpha.value
  }
})


function onCopy(key: string, value: any) {
  const copyValue = isArray(value) ? value.join(', ') : value
  console.log(`Copied ${key} value: ${copyValue}`)
}

function onCopied(key: string, value: any) {
  const copyValue = isArray(value) ? value.join(', ') : value
}


</script>

<template>
  <div class="flex flex-col relative size-full">
    <output :style="{ backgroundColor: keyColorHex }"
            class="aspect-video size-full rounded-md" />
    <div class=" inset-0 p-4 scrollbar overflow-y-auto">
      <div v-for="(value, key) in paletteKeyColorConverts" :key="key" class="grid grid-cols-[100px,1fr] items-center">
        <label class="leading-none text-on-surface capitalize text-body-lg">{{ key }}</label>
        <div v-if="isArray(value)" class="grid grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
          <div v-for="(v,i) in value" :key="i" class="bg-transparent p-1 outline-none tabular-nums end min-w-[28px]">
            {{ roundNumber(v, 0) }}
          </div>
          <SaveToClipboard :source="value" class="col-start-5" />
        </div>
        <div v-else>
          <input :value="value" class="bg-transparent p-1 outline-none " readonly />
        </div>
      </div>
    </div>
  </div>
</template>
