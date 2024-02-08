<script lang="ts" setup>
import { argbFromHex, argbFromRgba, hexFromArgb, rgbaFromArgb } from '@material/material-color-utilities'
import { vMask } from '~/utils/directives/vMask'

defineProps<{ keyColor?: string }>()

const modelValue = defineModel<number>('modelValue', { type: Number, default: 0 })

const rgba = computed(() => rgbaFromArgb(modelValue.value))

const hex = computed({
  get: () => hexFromArgb(modelValue.value),
  set: (v: string) => {
    modelValue.value = argbFromHex(v)
  }
})

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
  <div class="grid">
    <div class="mb-8 grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-[1fr,auto]">
      <div>
        <ColorPreview :color="modelValue" class="size-full min-h-40" />
      </div>
      <div class="grid grid-cols-[auto,1fr] gap-x-4 gap-y-3 md:grid-cols-1">
        <div>
          <label class="mb-1.5 flex text-label-md">Hex</label>
          <fieldset class="relative">
            <input
              v-model="hex"
              class="min-w-24 max-w-32 rounded-md border border-outline-variant bg-surface p-2 pr-10 text-body-lg uppercase tabular-nums outline-transparent md:max-w-[164px]"
            />
            <SaveToClipboard :source="hex" class="absolute right-0 top-1/2 -translate-y-1/2 p-3" />
          </fieldset>
        </div>
        <div>
          <label class="mb-1.5 flex text-label-md">RGB</label>
          <fieldset class="flex gap-2">
            <input
              v-model="rgbaR"
              v-mask="{ min: 0, max: 255 }"
              class="w-14 min-w-0 rounded-md border border-outline-variant bg-surface p-2 text-center text-body-lg tabular-nums outline-transparent"
              inputmode="numeric"
              max="255"
              min="0"
              type="text"
            />
            <input
              v-model="rgbaG"
              v-mask="{ min: 0, max: 255 }"
              class="w-14 min-w-0 rounded-md border border-outline-variant bg-surface p-2 text-center text-body-lg tabular-nums outline-transparent"
              inputmode="numeric"
              max="255"
              min="0"
              type="text"
            />
            <input
              v-model="rgbaB"
              v-mask="{ min: 0, max: 255 }"
              class="w-14 min-w-0 rounded-md border border-outline-variant bg-surface p-2 text-center text-body-lg tabular-nums outline-transparent"
              inputmode="numeric"
              max="255"
              min="0"
              type="text"
            />
          </fieldset>
        </div>
      </div>
      <div class="sr-only mt-2">
        <details>
          <summary class="mb-1 flex cursor-pointer items-center gap-x-2 text-label-lg">
            HCT
            <Icon class="h-4 w-4 text-on-surface-variant" name="ic:baseline-unfold-more" />
          </summary>
          <p class="text-on-surface-variant">
            HCT is an abbreviation of hue chroma tone. It’s the name of the color space that enables dynamic
            color. HCT is based on CAM16 hue and chroma; the L* construct for luminance from L*a*b* (CIELAB,
            1976) is denoted as T for tone.
          </p>
        </details>
      </div>
    </div>
    <HctColorPicker v-model="modelValue" />
  </div>
</template>
