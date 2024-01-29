<script lang="ts" setup>
import { hexFromArgb, TonalPalette } from '@material/material-color-utilities'
import PaletteKeyColorPreview from '~/modules/theme/runtime/components/PaletteKeyColorPreview.vue'
import type { HctModel } from '~/modules/theme/types'

const { $dynamicScheme } = useNuxtApp()
const { sourceColor, contrastLevel } = useThemeConfig()

const primaryPalette = computed(() => {
  return $dynamicScheme.value.primaryPalette
})

const primaryPaletteKeyColor = computed(() => {
  const primaryPalette = $dynamicScheme.value.primaryPalette
  return primaryPalette.keyColor
})
const formModel = reactive<HctModel>({
  hue: Math.round(primaryPaletteKeyColor.value?.hue) ?? 0,
  chroma: Math.round(primaryPaletteKeyColor.value?.chroma) ?? 0,
  tone: Math.round(primaryPaletteKeyColor.value?.tone) ?? 0
})

const onHctFormModelChange = ({ hue, chroma, tone }: HctModel) => {
  sourceColor.value = hexFromArgb(TonalPalette.fromHueAndChroma(hue, chroma).tone(tone))
}

watch(formModel, onHctFormModelChange, { deep: true })

const { hue: hueSpectrum, chroma: chromaSpectrum, tone: toneSpectrum } = useHctSpectra('linear')

const customHandle = ref<HTMLElement | null>(null)

const contrastLevelMarksArr = computed(() => {
  return [
    { value: 0, label: 'Low' },
    { value: 0.5, label: 'Medium' },
    { value: 1, label: 'High' }
  ]
})

const contrastMarksObj = computed(() => ({
  0: 'Low',
  0.5: 'Medium',
  1: 'High'
}))
</script>

<template>
  <div class="flex flex-col gap-4  bg-surface-container overflow-clip">
    <fieldset class="flex flex-col justify-center items-center">
      <legend class="sr-only">Primary Palette Key Color</legend>
      <PaletteKeyColorPreview :palette="primaryPalette" />
    </fieldset>
    <fieldset class="flex flex-col rounded-md p-4 w-full">
      <legend class="sr-only">Color Picker</legend>
      <div class="flex flex-col gap-4">
        <div class="flex items-center ">
          <div class="flex justify-center items-center pr-3">
            <span class="text-label-lg font-medium leading-none text-outline">H</span>
          </div>
          <ExampleRangeSlider v-model="formModel.hue"
                              :stop-marks="false"
                              class="color-input-range"
                              contained="true"
                              decimals="0"
                              help-text="The type of color, such as red, blue, or green"
                              label="Hue"
                              max="360"
                              min="0"
                              round="0">
            <template #handle>
              <div ref="customHandle" class="custom-handle">
                <div :style="hueSpectrum" class="custom-handle-color" />
              </div>
            </template>
            <template #track>
              <SliderTrack :style="hueSpectrum" class="" fill="false" />
            </template>
          </ExampleRangeSlider>
          <div class="flex flex-col w-9 justify-center">
            <input v-model.number="formModel.hue" class="numeric-text-input" type="text" />
          </div>
        </div>
        <div class="flex items-center ">
          <div class="flex items-center justify-center pr-3">
            <span class="text-label-lg font-medium leading-none text-outline">C</span>
          </div>
          <ExampleRangeSlider v-model.number="formModel.chroma"
                              :stop-marks="false"
                              class="color-input-range"
                              contained="true"
                              decimals="0"
                              help-text="How colorful or neutral a color appears"
                              label="Chroma"
                              max="150"
                              min="0"
                              round="0">

            <template #handle>
              <div ref="customHandle" class="custom-handle" />
            </template>
            <template #track>
              <SliderTrack :style="chromaSpectrum" class="slider-track" fill="false" />
            </template>
          </ExampleRangeSlider>
          <div class="flex flex-col w-9 justify-center">
            <input v-model.number="formModel.chroma" class="numeric-text-input " type="text" />
          </div>
        </div>
        <div class="flex items-center">
          <div class="flex items-center justify-center pr-3">
            <span class="text-label-lg font-medium leading-none text-outline">T</span>
          </div>
          <ExampleRangeSlider v-model.number="formModel.tone"
                              :stop-marks="false"
                              class="color-input-range"
                              contained="true"
                              decimals="0"
                              help-text="The lightness or darkness of a color"
                              label="Tone"
                              max="100"
                              min="0"
                              round="0">

            <template #handle>
              <div ref="customHandle" class="custom-handle" />
            </template>
            <template #track>
              <SliderTrack :style="toneSpectrum" class="slider-track" fill="false" />
            </template>
          </ExampleRangeSlider>
          <div class="flex flex-col w-9 justify-center">
            <input v-model.number="formModel.tone" class="numeric-text-input" type="text" />
          </div>
        </div>
      </div>
    </fieldset>
    <fieldset class="flex flex-col  rounded-md p-4">
      <legend class="sr-only">Contrast Level</legend>
      <div class="flex items-center">
        <div class="flex justify-center items-center pr-3">
          <Icon class="size-6" name="ic:baseline-brightness-medium" />
        </div>
        <ExampleRangeSlider v-model.number="contrastLevel"
                            :marks="contrastMarksObj"
                            contained="true"
                            help-text="The difference in brightness between the fore- and background"
                            label="Contrast Level"
                            max="1"
                            min="0"
                            round="0">
          <template #handle>
            <div ref="customHandle" class="custom-handle contrast-input-handle" />
          </template>
        </ExampleRangeSlider>
        <div class="flex flex-col w-10 justify-center ">
          <input v-model.number="contrastLevel" class="numeric-text-input" type="text" />
        </div>
      </div>
    </fieldset>
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
