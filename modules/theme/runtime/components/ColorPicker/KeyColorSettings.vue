<script lang="ts" setup>
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
    <ColorPreview :color="modelValue" class="mb-6" />
    <div class="flex flex-col">
      <HctMathEquation class="mt-2 text-xl leading-loose" />
    </div>

    <Tooltip>
      <p class="w-fit text-end text-body-sm text-on-surface-variant">What is HCT?</p>
      <template #content>
        <p class="text-start">
          HCT is an abbreviation of hue chroma tone. It’s the name of the color space that enables dynamic
          color. HCT is based on CAM16 hue and chroma; the L* construct for luminance from L*a*b* (CIELAB,
          1976) is denoted as T for tone.
        </p>
      </template>
    </Tooltip>

    <HctColorPicker v-model="modelValue" />
  </div>
</template>
