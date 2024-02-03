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

function onUpdate(event: Event, key: keyof HctModel) {
  formModel[key] = parseInt((event.target as HTMLInputElement).value, 10)
}
</script>

<template>
  <div class="flex flex-col gap-y-3">
    <div class="flex flex-col items-center">
      <div class="flex w-full flex-nowrap justify-between pb-2">
        <label
          class="mx-1 px-1 px-1 py-2 py-2 text-label-lg leading-none text-on-surface-variant"
          for="hue"
        >
          Hue
        </label>
        <input
          id="hue"
          :value="Math.round(formModel.hue)"
          class="w-[52px] min-w-0 rounded-md bg-transparent px-3 py-2 text-center text-on-surface-variant hover:bg-surface-container-high focus:bg-surface-container focus:outline-1 focus-visible:outline focus-visible:outline-on-surface active:bg-surface-container"
          inputmode="numeric"
          pattern="[0-9\s]{13,19}"
          type="text"
          @input="onUpdate($event, 'hue')"
        />
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
    </div>
    <div class="flex flex-col items-center">
      <div class="flex w-full flex-nowrap justify-between pb-2">
        <label
          class="mx-1 flex px-1 py-2 text-label-lg leading-none text-on-surface-variant"
          for="hue"
        >
          Chroma
        </label>
        <input
          id="chroma"
          :value="Math.round(formModel.chroma)"
          class="w-[52px] rounded-md bg-transparent px-3 py-2 text-center text-on-surface-variant hover:bg-surface-container-high focus:bg-surface-container focus:outline-1 focus-visible:outline focus-visible:outline-on-surface active:bg-surface-container"
          inputmode="numeric"
          pattern="[0-9\s]{13,19}"
          type="text"
          @input="onUpdate($event, 'chroma')"
        />
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
    </div>
    <div class="flex flex-col items-center">
      <div class="flex w-full flex-nowrap justify-between pb-2">
        <label
          class="mx-1 px-1 py-2 text-label-lg leading-none text-on-surface-variant"
          for="tone"
        >
          Tone
        </label>
        <input
          id="tone"
          :value="Math.round(formModel.tone)"
          class="w-[52px] rounded-md bg-transparent px-3 py-2 text-center text-on-surface-variant hover:bg-surface-container-high focus:bg-surface-container focus:outline-1 focus-visible:outline focus-visible:outline-on-surface active:bg-surface-container"
          inputmode="numeric"
          pattern="[0-9\s]{13,19}"
          type="text"
          @input="onUpdate($event, 'tone')"
        />
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
    </div>
  </div>
</template>

<style>
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

  &.active {
    @apply bg-surface-bright/20;
  }

  &.contrast-input-handle {
    @apply bg-surface-container-high;
  }
}

.slider-root.color-input-range {
  --slider-track-height: 22px;
}
</style>
