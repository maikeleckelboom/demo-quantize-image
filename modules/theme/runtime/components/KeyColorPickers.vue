<script lang="ts" setup>
import { hexFromArgb, TonalPalette } from '@material/material-color-utilities'

const { $dynamicScheme } = useNuxtApp()
const { sourceColor, contrastLevel } = useThemeConfig()

const primaryKeyColor = computed(() => {
  const primaryPalette = $dynamicScheme.value.primaryPalette
  return primaryPalette.keyColor
})

type FormModel = {
  hue: number
  chroma: number
  tone: number
}

const formModel = reactive<FormModel>({
  hue: Math.round(primaryKeyColor.value?.hue) ?? 0,
  chroma: Math.round(primaryKeyColor.value?.chroma) ?? 0,
  tone: Math.round(primaryKeyColor.value?.tone) ?? 0
})

const onHctFormModelChange = ({ hue, chroma, tone }: FormModel) => {
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
  <div class="flex flex-col gap-4 max-w-md bg-surface-container">
    <fieldset class="flex flex-col  justify-center items-center">
      <legend class="sr-only">Primary Palette Key Color</legend>
      <div class="flex flex-col relative size-full">
        <output :style="{ backgroundColor: sourceColor }"
                class="aspect-video w-full rounded-md flex justify-center items-center" />
        <div class="absolute inset-0 flex justify-center items-center">
        <span class="text-display-sm uppercase font-black tabular-nums">
          {{ hexFromArgb(primaryKeyColor.toInt()) }}
        </span>
        </div>
      </div>
    </fieldset>
    <fieldset class="flex flex-col rounded-md p-4 w-full">
      <legend class="sr-only">HCT Color Picker</legend>
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
.numeric-text-input {
  @apply relative overflow-clip bg-transparent border-none outline-none text-end tabular-nums text-body-lg;
  @apply after:absolute after:bg-transparent after:inset-0 after:z-0;
  @apply hover:after:bg-surface-level-1 focus-visible:after:bg-surface-level-2 active:after:bg-surface-level-3;
}

.custom-handle {
  width: var(--slider-handle-width);
  height: var(--slider-handle-height);
  border-radius: 50%;
  border: solid 2px rgb(var(--outline-rgb));
  outline-color: rgb(var(--primary-rgb));

  &.contrast-input-handle {
    @apply bg-surface-container-high;
  }

  &:focus {
  }
}

.slider-root.color-input-range {
  --slider-track-height: 22px;

  .slider-track {
    /*
        --_height: 10px;*/
  }
}
</style>
