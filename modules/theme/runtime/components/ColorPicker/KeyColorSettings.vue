<script lang="ts" setup>
import HctMathEquation from '~/components/HctMathEquation.vue'

withDefaults(
  defineProps<{
    keyColor?: string
  }>(),
  {
    keyColor: ''
  }
)

const modelValue = defineModel<number>('modelValue', { type: Number, default: 0 })

function getKeyColorName(keyColor: string) {
  return sentenceCase(`sourceColor` === keyColor ? keyColor : `${keyColor} Key Color`)
}
</script>

<template>
  <div class="grid">
    <h1 class="mb-6 text-headline-sm font-medium capitalize">{{ getKeyColorName(keyColor) }}</h1>
    <div class="mb-12 flex flex-col">
      <h2 class="mb-4 text-title-lg leading-none">HCT</h2>
      <p class="text-on-surface-variant">
        HCT is an abbreviation of hue chroma tone . It’s the name of the color space that enables dynamic
        color. HCT is based on CAM16 hue and chroma; the L* construct for luminance from L*a*b* (CIELAB, 1976)
        is denoted as T for tone.
      </p>
      <div class="mt-2">
        <HctMathEquation class="text-xl" />
      </div>
    </div>
    <HctColorPicker v-model="modelValue" />
  </div>
</template>
