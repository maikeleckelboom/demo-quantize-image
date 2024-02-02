<script lang="ts" setup>
import { Hct, hexFromArgb, TonalPalette } from '@material/material-color-utilities'
import type { HctModel } from '~/modules/theme/types'

function splitByCases(str: string) {
  return str
    .split(/(?=[A-Z])/)
    .map((s) => s.toLowerCase())
    .join(' ')
}

const { $dynamicScheme } = useNuxtApp()
const { sourceColor, contrastLevel } = useThemeConfig()

const sourceColorArgb = computed(() => {
  return $dynamicScheme.value.sourceColorArgb
})

const palettes = computed(() => {
  return Object.keys($dynamicScheme.value).reduce(
    (acc, key) => {
      const palette = $dynamicScheme.value[key as keyof typeof $dynamicScheme.value]
      if (palette instanceof TonalPalette) {
        acc.push({
          key,
          palette
        })
      }
      return acc
    },
    [] as { key: string; palette: TonalPalette }[]
  )
})

const primaryPaletteKeyColor = computed(() => {
  const primaryPalette = $dynamicScheme.value.primaryPalette
  return primaryPalette.keyColor
})

const formModel = reactive<HctModel>({
  hue: Hct.fromInt(sourceColorArgb.value).hue,
  chroma: Hct.fromInt(sourceColorArgb.value).chroma,
  tone: Hct.fromInt(sourceColorArgb.value).tone
})

const onHctFormModelChange = ({ hue, chroma, tone }: HctModel) => {
  sourceColor.value = hexFromArgb(TonalPalette.fromHueAndChroma(hue, chroma).tone(tone))
}

watch(formModel, onHctFormModelChange, { deep: true })

const { hue: hueSpectrum, chroma: chromaSpectrum, tone: toneSpectrum } = useHctSpectra('linear')

const customHandle = ref<HTMLElement | null>(null)
</script>

<template>
  <div class="flex flex-col gap-12">
    <section class="flex w-full flex-col rounded-md">
      <div class="mb-4">
        <h1 class="mb-0.5 text-label-lg">HCT Color</h1>
        <p class="text-sm text-on-surface-variant">
          The HCT color model is a perceptually uniform color space that is designed to be more intuitive and easier to
          use than other color models.
        </p>
      </div>
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
    <section class="flex flex-col rounded-md">
      <ContrastSlider v-model.number="contrastLevel" max="1" min="0" step="0.1" />
    </section>
    <section>
      <div class="mb-4">
        <h1 class="col-span-full mb-0.5 text-title-lg">Palettes</h1>
        <p class="col-span-full text-sm text-on-surface-variant">
          The color palettes that are generated from the source color.
        </p>
      </div>
      <div class="grid grid-cols-3 gap-4">
        <div v-for="({ key, palette }, idx) in palettes" class="flex flex-col">
          <h1 class="mb-2 capitalize">
            {{
              splitByCases(key)
                .split(' ')
                .filter((s) => s !== 'palette' && s !== 'key' && s !== 'color')
                .join(' ')
            }}
          </h1>
          <PaletteKeyColorPreview :palette="palette" />
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
