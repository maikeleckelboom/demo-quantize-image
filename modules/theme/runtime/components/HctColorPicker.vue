<script lang="ts" setup>
import { Hct, hexFromArgb, TonalPalette } from '@material/material-color-utilities'
import type { HctModel } from '~/modules/theme/types'

const { $dynamicScheme } = useNuxtApp()

const sourceColorArgb = computed(() => {
  return $dynamicScheme.value.sourceColorArgb
})

const formModel = reactive<HctModel>({
  hue: Hct.fromInt(sourceColorArgb.value).hue,
  chroma: Hct.fromInt(sourceColorArgb.value).chroma,
  tone: Hct.fromInt(sourceColorArgb.value).tone
})

const { sourceColor } = useThemeConfig()

watch(
  formModel,
  ({ hue, chroma, tone }: HctModel) => {
    sourceColor.value = hexFromArgb(TonalPalette.fromHueAndChroma(hue, chroma).tone(tone))
  },
  { deep: true }
)

const { hue: hueSpectrum, chroma: chromaSpectrum, tone: toneSpectrum } = useHCTSpectra()

function onUpdate(event: Event, key: keyof HctModel) {
  formModel[key] = parseInt((event.target as HTMLInputElement).value, 10)
}

const customHandle = ref<HTMLElement | null>(null)
</script>

<template>
  <div class="flex flex-col space-y-1.5">
    <div class="grid grid-cols-[auto,1fr,auto] items-center">
      <label
        class="mr-4 flex items-center p-2 text-title-sm leading-none text-on-surface-variant"
        for="hue"
      >
        H
      </label>
      <InputRangeSlider
        v-model="formModel.hue"
        class="color-input-range"
        contained="true"
        help-text="The type of color, such as red, blue, or green"
        label="Hue"
        max="360"
        min="0"
      >
        <template #handle>
          <div ref="customHandle" class="custom-handle" />
        </template>
        <template #track>
          <SliderTrack :style="hueSpectrum" class="size-full" fill="false" />
        </template>
      </InputRangeSlider>
      <div class="ml-2 flex">
        <input
          id="hue"
          :value="Math.round(formModel.hue)"
          class="h-[38px] w-[52px] min-w-0 rounded-lg bg-transparent px-3 py-2 text-center text-on-surface-variant hover:bg-surface-container-high focus:bg-surface-container focus:outline-1 focus-visible:outline focus-visible:outline-on-surface active:bg-surface-container"
          inputmode="numeric"
          pattern="[0-9\s]{13,19}"
          type="text"
          @input="onUpdate($event, 'hue')"
        />
      </div>
    </div>
    <div class="grid grid-cols-[auto,1fr,auto] items-center">
      <label
        class="mr-4 flex items-center p-2 text-title-sm leading-none text-on-surface-variant"
        for="hue"
      >
        C
      </label>
      <InputRangeSlider
        v-model.number="formModel.chroma"
        class="color-input-range"
        contained="true"
        label="Chroma"
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
      <div class="ml-2 flex">
        <input
          id="chroma"
          :value="Math.round(formModel.chroma)"
          class="h-[38px] w-[52px] rounded-lg bg-transparent px-3 py-2 text-center text-on-surface-variant hover:bg-surface-container-high focus:bg-surface-container focus:outline-1 focus-visible:outline focus-visible:outline-on-surface active:bg-surface-container"
          inputmode="numeric"
          pattern="[0-9\s]{13,19}"
          type="text"
          @input="onUpdate($event, 'chroma')"
        />
      </div>
    </div>
    <div class="grid grid-cols-[auto,1fr,auto] items-center">
      <label
        class="mr-4 flex items-center p-2 text-title-sm leading-none text-on-surface-variant"
        for="tone"
      >
        T
      </label>
      <InputRangeSlider
        v-model.number="formModel.tone"
        class="color-input-range"
        contained="true"
        decimals="0"
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
      <div class="ml-2 flex">
        <input
          id="tone"
          :value="Math.round(formModel.tone)"
          class="h-[38px] w-[52px] rounded-lg bg-transparent px-3 py-2 text-center text-on-surface-variant hover:bg-surface-container-high focus:bg-surface-container focus:outline-1 focus-visible:outline focus-visible:outline-on-surface active:bg-surface-container"
          inputmode="numeric"
          pattern="[0-9\s]{13,19}"
          type="text"
          @input="onUpdate($event, 'tone')"
        />
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
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
