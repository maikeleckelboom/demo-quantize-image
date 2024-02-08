<script lang="ts" setup>
import { Hct, hexFromArgb, TonalPalette } from '@material/material-color-utilities'
import type { HctModel } from '~/modules/theme/types'
import Tooltip from '~/modules/base/runtime/components/Tooltip.vue'
import { vMask } from '~/modules/theme/runtime/utils/directives/vMask'

const modelValue = defineModel<number>('modelValue', { type: Number, default: 0 })

function getHue() {
  return Hct.fromInt(modelValue.value).hue
}

function getChroma() {
  return Hct.fromInt(modelValue.value).chroma
}

function getTone() {
  return Hct.fromInt(modelValue.value).tone
}

function argbFromHct({ hue, chroma, tone }: HctModel) {
  return TonalPalette.fromHueAndChroma(hue, chroma).tone(tone)
}

function hexFromHct({ hue, chroma, tone }: HctModel) {
  return hexFromArgb(argbFromHct({ hue, chroma, tone }))
}

const formModel = reactive<HctModel>({
  hue: getHue(),
  chroma: getChroma(),
  tone: getTone()
})

const { pause, resume } = watchPausable(
  modelValue,
  (v) => {
    formModel.hue = getHue()
    formModel.chroma = getChroma()
    formModel.tone = getTone()
  },
  { immediate: true }
)

watch(formModel, (v: HctModel) => {
  pause()
  modelValue.value = argbFromHct(v)
  nextTick(() => {
    resume()
  })
})

const { hue: hueSpectrum, chroma: chromaSpectrum, tone: toneSpectrum, bounds } = useHCTSpectra()

function onUpdate(event: Event, key: keyof HctModel) {
  formModel[key] = parseInt((event.target as HTMLInputElement).value, 10)
}

const customHandle = ref<HTMLElement>()

function validate(value: number, key: keyof HctModel) {}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="grid items-center gap-y-2">
      <div class="flex items-center justify-between">
        <div class="flex flex-col">
          <label class="flex flex-nowrap gap-x-2 text-label-md" for="hue">
            Hue
            <Tooltip>
              <button>
                <Icon class="h-4 w-4 text-on-surface-variant" name="ic:baseline-info" />
              </button>
              <template #content> The type of color, such as red, blue, or green.</template>
            </Tooltip>
          </label>
        </div>
        <input
          id="hue"
          v-mask="{ min: 0, max: 360 }"
          :value="Math.round(formModel.hue)"
          class="h-[34px] w-[52px] min-w-0 rounded-lg bg-transparent px-3 py-2 text-center text-on-surface-variant focus:outline-none"
          inputmode="numeric"
          max="0"
          min="360"
          pattern="[0-9\s]{13,19}"
          type="text"
          @input="onUpdate($event, 'hue')"
        />
      </div>
      <InputRangeSlider v-model="formModel.hue" class="color-input-slider" contained="true" max="360" min="0">
        <template #handle>
          <div ref="customHandle" class="custom-handle" />
        </template>
        <template #track>
          <SliderTrack :style="hueSpectrum" class="size-full" fill="false" />
        </template>
      </InputRangeSlider>
    </div>
    <div class="grid items-center gap-y-2">
      <div class="flex items-center justify-between">
        <div class="flex flex-col">
          <label class="flex flex-nowrap gap-x-2 text-label-md" for="chroma">
            Chroma
            <Tooltip>
              <button>
                <Icon class="h-4 w-4 text-on-surface-variant" name="ic:baseline-info" />
              </button>
              <template #content> The intensity of a color, from gray to fully saturated.</template>
            </Tooltip>
          </label>
        </div>
        <input
          id="chroma"
          v-mask="{ min: 0, max: 150 }"
          :value="Math.round(formModel.chroma)"
          class="h-[34px] w-[52px] rounded-lg bg-transparent px-3 py-2 text-center text-on-surface-variant focus:outline-none focus-visible:outline-none"
          inputmode="numeric"
          pattern="[0-9\s]{13,19}"
          type="text"
          @input="onUpdate($event, 'chroma')"
        />
      </div>
      <InputRangeSlider
        v-model.number="formModel.chroma"
        class="color-input-slider"
        contained="true"
        max="150"
        min="0"
      >
        <template #handle>
          <div ref="customHandle" class="custom-handle" />
        </template>
        <template #track>
          <SliderTrack :style="chromaSpectrum" class="slider-track" fill="false" />
        </template>
      </InputRangeSlider>
    </div>
    <div class="grid items-center gap-y-2">
      <div class="flex items-center justify-between">
        <div class="flex flex-col">
          <label class="flex flex-nowrap gap-x-2 text-label-md" for="tone">
            Tone
            <Tooltip>
              <button class=" ">
                <Icon class="h-4 w-4 text-on-surface-variant" name="ic:baseline-info" />
              </button>
              <template #content> The amount of white or black mixed with the color.</template>
            </Tooltip>
          </label>
        </div>
        <input
          id="tone"
          v-mask="{ min: 0, max: 100 }"
          :value="Math.round(formModel.tone)"
          class="h-[34px] w-[52px] rounded-lg bg-transparent px-3 py-2 text-center text-on-surface-variant focus:outline-none focus-visible:outline-none"
          inputmode="numeric"
          pattern="[0-9\s]{13,19}"
          type="text"
          @input="onUpdate($event, 'tone')"
        />
      </div>
      <InputRangeSlider
        v-model.number="formModel.tone"
        class="color-input-slider"
        contained="true"
        max="100"
        min="0"
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
</template>

<style lang="postcss">
.slider-root.color-input-slider {
  --slider-track-height: 16px;
  --slider-handle-width: 20px;
  --slider-handle-height: 20px;
}

.custom-handle {
  width: var(--slider-handle-width);
  height: var(--slider-handle-height);
  border-radius: 50%;
  border: solid 2px rgb(var(--on-surface-rgb));
  outline-color: rgb(var(--primary-rgb));

  transition-property: all;
  transition-duration: 0.15s;
  transition-timing-function: ease-in-out;

  &:hover {
    @apply bg-surface-bright/10;
  }
}
</style>
