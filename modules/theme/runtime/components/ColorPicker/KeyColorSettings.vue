<script lang="ts" setup>
import { argbFromHex, argbFromRgba, hexFromArgb, rgbaFromArgb } from '@material/material-color-utilities'
import { vMask } from '~/modules/theme/runtime/utils/directives/vMask'

withDefaults(
  defineProps<{
    keyColor?: string
  }>(),
  {
    keyColor: ''
  }
)

const modelValue = defineModel<number>('modelValue', { type: Number, default: 0 })

const rgba = computed(() => rgbaFromArgb(modelValue.value))

const hex = computed({
  get: () => hexFromArgb(modelValue.value),
  set: (v: string) => {
    modelValue.value = argbFromHex(v)
  }
})

function getKeyColorName(keyColor: string) {
  return sentenceCase(`sourceColor` === keyColor ? keyColor : `${keyColor} Key Color`)
}

const rgbaR = computed({
  get: () => rgba.value.r,
  set: (v: number) => {
    modelValue.value = argbFromRgba({ ...rgba.value, r: v })
  }
})

const rgbaG = computed({
  get: () => rgba.value.g,
  set: (v: number) => {
    modelValue.value = argbFromRgba({ ...rgba.value, g: v })
  }
})

const rgbaB = computed({
  get: () => rgba.value.b,
  set: (v: number) => {
    modelValue.value = argbFromRgba({ ...rgba.value, b: v })
  }
})
</script>

<template>
  <div class="mb-10 grid">
    <h1 class="mb-4 text-headline-sm font-medium capitalize">{{ getKeyColorName(keyColor) }}</h1>
    <div class="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-[1fr,auto]">
      <div class="mb-2">
        <ColorPreview :color="modelValue" class="size-full min-h-40" />
      </div>
      <div class="grid grid-cols-[auto,1fr] gap-x-4 gap-y-3 md:grid-cols-1">
        <div>
          <label class="mb-1.5 flex text-label-md">Hex</label>
          <input
            v-model="hex"
            class="w-24 min-w-0 rounded-md border border-outline-variant bg-surface p-2 text-body-lg uppercase tabular-nums outline-transparent"
          />
        </div>
        <div>
          <label class="mb-1.5 flex text-label-md">RGB</label>
          <fieldset class="flex gap-2">
            <input
              v-model="rgbaR"
              v-mask="{ min: 0, max: 255 }"
              class="w-12 min-w-0 rounded-md border border-outline-variant bg-surface p-2 text-center text-body-lg tabular-nums outline-transparent"
              inputmode="numeric"
              max="255"
              min="0"
              type="text"
            />
            <input
              v-model="rgbaG"
              v-mask="{ min: 0, max: 255 }"
              class="w-12 min-w-0 rounded-md border border-outline-variant bg-surface p-2 text-center text-body-lg tabular-nums outline-transparent"
              inputmode="numeric"
              max="255"
              min="0"
              type="text"
            />
            <input
              v-model="rgbaB"
              v-mask="{ min: 0, max: 255 }"
              class="w-12 min-w-0 rounded-md border border-outline-variant bg-surface p-2 text-center text-body-lg tabular-nums outline-transparent"
              inputmode="numeric"
              max="255"
              min="0"
              type="text"
            />
          </fieldset>
        </div>
      </div>
      <div class="mb-4">
        <h3 class="mb-1 text-label-lg">HCT</h3>
        <p class="text-on-surface-variant">
          HCT is an abbreviation of hue chroma tone. It’s the name of the color space that enables dynamic
          color. HCT is based on CAM16 hue and chroma; the L* construct for luminance from L*a*b* (CIELAB,
          1976) is denoted as T for tone.
        </p>
      </div>
    </div>
    <HctColorPicker v-model="modelValue" />
  </div>
</template>
