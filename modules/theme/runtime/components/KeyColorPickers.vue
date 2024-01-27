<script lang="ts" setup>
import {hexFromArgb, TonalPalette} from '@material/material-color-utilities'

const {$dynamicScheme} = useNuxtApp()
const {sourceColor, contrastLevel} = useThemeConfig()

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
  hue: primaryKeyColor.value?.hue ?? 0,
  chroma: primaryKeyColor.value?.chroma ?? 0,
  tone: primaryKeyColor.value?.internalTone ?? 0
})

const onHctFormModelChange = ({hue, chroma, tone}: FormModel) => {
  sourceColor.value = hexFromArgb(TonalPalette.fromHueAndChroma(hue, chroma).tone(tone))
}

watch(formModel, onHctFormModelChange, {deep: true})

const {hue: hueSpectrum, chroma: chromaSpectrum, tone: toneSpectrum} = useHctSpectra('linear')

const textMap = ref<Record<string, boolean>>({
  hue: false,
  chroma: false,
  tone: false,
  contrast: false
})


const customHandle = ref<HTMLElement | null>(null)

const contrastLevelMarksArr = computed(() => {
  return [
    {value: 0, label: 'Low'},
    {value: 0.5, label: 'Medium'},
    {value: 1, label: 'High'}
  ]
})

const contrastMarksObj = computed(() => ({
  0: 'Low',
  0.5: 'Medium',
  1: 'High'
}))
</script>

<template>
  <div class="flex flex-col gap-y-6">
    <section>
      <fieldset class="mb-4">
        <div class="mb-6 mt-4">
          <label class="text-label-lg">Hue</label>
          <button tabindex="-1" @click="textMap.hue = !textMap.hue">
            <Icon class="text-on-surface-variant ml-3 cursor-pointer size-4" name="ic:outline-info"/>
          </button>
          <p v-show="textMap.hue" class="mt-1.5 text-on-surface-variant text-sm">
            The type of color, such as red, blue, or green
          </p>
        </div>

        <ExampleRangeSlider
            v-model="formModel.hue"
            :custom-track="true"
            :stop-marks="false"
            class="color-input-range hue-input-range"
            contained="true"
            max="360"
            min="0"
        >
          <template #handle>
            <div ref="customHandle" class="custom-handle"/>
          </template>
          <template #track>
            <SliderTrack :style="hueSpectrum" class="" fill="false"/>
          </template>
        </ExampleRangeSlider>
      </fieldset>
      <fieldset class="mb-4">
        <div class="mb-6 mt-4">
          <label class="text-label-lg">Chroma</label>
          <button tabindex="-1" @click="textMap.chroma = !textMap.chroma">
            <Icon class="text-on-surface-variant ml-3 cursor-pointer size-4" name="ic:outline-info"/>
          </button>
          <p v-show="textMap.chroma" class="mt-1.5 text-on-surface-variant text-sm">
            How colorful or neutral a color appears
          </p>
        </div>
        <ExampleRangeSlider v-model="formModel.chroma" :contained="true" :max="150" :min="0" :step="1"
                          :stop-marks="false"
                          class="color-input-range">

          <template #handle>
            <div ref="customHandle" class="custom-handle"/>
          </template>
          <template #track>
            <SliderTrack :style="chromaSpectrum" class="slider-track" fill="false"/>
          </template>
        </ExampleRangeSlider>
      </fieldset>
      <fieldset class="mb-4">
        <div class="mb-6 mt-4">
          <label class="text-label-lg">Tone</label>
          <button tabindex="-1" @click="textMap.tone = !textMap.tone">
            <Icon class="text-on-surface-variant ml-3 cursor-pointer size-4" name="ic:outline-info"/>
          </button>
          <p v-show="textMap.tone" class="mt-1.5 text-on-surface-variant text-sm">
            The amount of white or black mixed with the color
          </p>
        </div>
        <ExampleRangeSlider
            v-model="formModel.tone"
            :contained="true"
            :max="100"
            :min="0"
            :step="1"
            :stop-marks="false"
            :trackStyle="toneSpectrum"
            class="color-input-range">
          <template #handle>
            <div ref="customHandle" class="custom-handle"/>
          </template>
          <template #track>
            <SliderTrack :style="toneSpectrum" class="slider-track" fill="false"/>
          </template>
        </ExampleRangeSlider>
      </fieldset>
      <fieldset class="mb-4">
        <div class="mb-6 mt-4">
          <label class="text-label-lg">Contrast Level</label>
          <button tabindex="-1" @click="textMap.contrast = !textMap.contrast">
            <Icon class="text-on-surface-variant ml-3 cursor-pointer size-4" name="ic:outline-info"/>
          </button>
          <p v-show="textMap.contrast" class="mt-1.5 text-on-surface-variant text-sm">
            The difference in brightness between the fore- and background
          </p>
        </div>
        <div class="flex flex-col">
          <ExampleRangeSlider
              v-model="contrastLevel"
              :marks="contrastMarksObj"
              contained="true"
              max="1"
              min="0"
              step="0.1"
          />
        </div>
      </fieldset>
    </section>

  </div>
</template>

<style>
.custom-handle {
  width: var(--slider-handle-width);
  height: var(--slider-handle-height);
  border-radius: 50%;
  border: solid 2px rgb(var(--outline-rgb));


  &:focus {
  }
}

.color-input-range {
  .slider-handle {


  }


  .slider-track{
    --_height: 20px;
  }

  &.hue-input-range {

  }
}
</style>
