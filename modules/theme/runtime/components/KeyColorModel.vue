<script lang="ts" setup>
import { Hct, hexFromArgb, TonalPalette } from '@material/material-color-utilities'
import type { HctModel } from '~/modules/theme/types'
import { useHCTSpectra } from '~/modules/theme/runtime/composables/useHCTSpectra'

const { $dynamicScheme } = useNuxtApp()
const { sourceColor } = useThemeConfig()

const sourceColorArgb = computed(() => {
  return $dynamicScheme.value.sourceColorArgb
})

const formModel = reactive<HctModel>({
  hue: Hct.fromInt(sourceColorArgb.value).hue,
  chroma: Hct.fromInt(sourceColorArgb.value).chroma,
  tone: Hct.fromInt(sourceColorArgb.value).tone
})

watch(
  formModel,
  ({ hue, chroma, tone }: HctModel) => {
    sourceColor.value = hexFromArgb(TonalPalette.fromHueAndChroma(hue, chroma).tone(tone))
  },
  { deep: true }
)

const {
  hue: hueSpectrum,
  chroma: chromaSpectrum,
  tone: toneSpectrum
} = useHCTSpectra('linear')

const customHandle = ref<HTMLElement | null>(null)
</script>

<template>
  <div class="flex flex-col gap-12">
    <section class="flex w-full flex-col rounded-md">
      <details class="mb-4">
        <summary class="mb-0.5 text-label-lg">HCT Color</summary>
        <p class="text-sm text-on-surface-variant">
          The HCT color model is based on the Hue, Chroma, and Tone of a color.
        </p>
      </details>
      <div class="flex flex-col gap-4">
        <div class="flex items-center">
          <InputRangeSlider
            v-model="formModel.hue"
            :stop-marks="false"
            class="color-input-range"
            contained="true"
            decimals="0"
            help-text="The type of color, such as red, blue, or green"
            label="Hue"
            max="360"
            min="0"
            round="0"
          >
            <template #handle>
              <div ref="customHandle" class="custom-handle">
                <div :style="hueSpectrum" class="custom-handle-color" />
              </div>
            </template>
            <template #track>
              <SliderTrack :style="hueSpectrum" class="" fill="false" />
            </template>
          </InputRangeSlider>
        </div>
        <div class="flex items-center">
          <InputRangeSlider
            v-model.number="formModel.chroma"
            :stop-marks="false"
            class="color-input-range"
            contained="true"
            decimals="0"
            help-text="How colorful or neutral a color appears"
            label="Chroma"
            max="150"
            min="0"
            round="0"
          >
            <template #handle>
              <div ref="customHandle" class="custom-handle" />
            </template>
            <template #track>
              <SliderTrack :style="chromaSpectrum" class="slider-track" fill="false" />
            </template>
          </InputRangeSlider>
        </div>
        <div class="flex items-center">
          <InputRangeSlider
            v-model.number="formModel.tone"
            class="color-input-range"
            contained="true"
            decimals="0"
            help-text="The lightness or darkness of a color"
            label="Tone"
            max="100"
            min="0"
            round="0"
          >
            <template #handle>
              <div ref="customHandle" class="custom-handle" />
            </template>
            <template #track>
              <SliderTrack :style="toneSpectrum" class="slider-track" fill="false" />
            </template>
          </InputRangeSlider>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
.custom-handle {
  width: var(--slider-handle-width);
  height: var(--slider-handle-height);
  border-radius: 50%;
  border: solid 2px rgb(var(--on-surface-rgb));
  outline-color: rgb(var(--primary-rgb));

  &.contrast-input-handle {
    @apply bg-surface-container-high;
  }
}

.slider-root.color-input-range {
  --slider-track-height: 22px;
}
</style>
