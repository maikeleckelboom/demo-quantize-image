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
  <div class="flex flex-col gap-4 overflow-clip">
    <section>
      <h1 class="mb-3 text-headline-sm">Source Color</h1>
      <div :style="{ background: hexFromArgb(sourceColorArgb) }" class="aspect-video size-32 rounded-md"></div>
    </section>

    <section class="flex w-full flex-col rounded-md">
      <h1 class="mb-3 text-headline-sm">
        <!-- title -->
        Color Model
      </h1>
      <div class="flex flex-col gap-4">
        <div class="flex items-center">
          <div class="flex items-center justify-center pr-3">
            <span class="text-label-lg font-medium leading-none text-outline"> H </span>
          </div>
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
          <div class="ml-4 flex min-w-10 max-w-[35px] flex-col justify-center">
            <input v-model.number="formModel.hue" class="numeric-text-input" type="text" />
          </div>
        </div>
        <div class="flex items-center">
          <div class="flex items-center justify-center pr-3">
            <span class="text-label-lg font-medium leading-none text-outline"> C </span>
          </div>
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
          <div class="ml-4 flex min-w-10 max-w-[35px] flex-col justify-center">
            <input v-model.number="formModel.chroma" class="numeric-text-input" type="text" />
          </div>
        </div>
        <div class="flex items-center">
          <div class="flex items-center justify-center pr-3">
            <span class="text-label-lg font-medium leading-none text-outline"> T </span>
          </div>
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
          <div class="ml-4 flex min-w-10 max-w-[35px] flex-col justify-center">
            <input v-model.number="formModel.tone" class="numeric-text-input" type="text" />
          </div>
        </div>
      </div>
    </section>
    <section class="flex flex-col rounded-md">
      <h1 class="mb-3 text-headline-sm">Contrast Level</h1>
      <div class="flex items-center">
        <div class="mr-4 flex items-center justify-center">
          <Icon class="size-6" name="ic:baseline-brightness-medium" />
        </div>
        <MaterialSlider
          v-model.number="contrastLevel"
          help-text="The difference in brightness between the fore- and background"
          label="Contrast Level"
          max="1"
          min="0"
          step="0.1"
        >
        </MaterialSlider>
      </div>
    </section>
    <section class="grid grid-cols-3 gap-4">
      <h1 class="col-span-full mb-2 text-headline-sm">Palettes</h1>
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
    </section>
    <section class="">
      <h1 class="mb-2 text-headline-sm">Scheme Variant</h1>
      <SelectVariant />
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
