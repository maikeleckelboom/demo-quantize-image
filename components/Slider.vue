<script lang="ts" setup>
import type { SliderProps } from '~/modules/slider/types'

defineProps<SliderProps>()

const modelValue = defineModel<number | number[]>({
  type: [Number, Array],
  default: 0
})
</script>

<template>
  <InputRangeSlider id="vm-slider" v-model="modelValue" v-bind="$props" />
</template>

<style>
#vm-slider {
  --slider-track-color: rgb(var(--primary-container-rgb));
  --slider-track-border-color: transparent;
  --slider-fill-color: rgb(var(--primary-rgb));
  --slider-handle-border-radius: 4px;
  --slider-horizontal-handle-width: 10px;
  --slider-horizontal-handle-height: 38px;

  --slider-horizontal-height: 8px;
  --slider-track-border: 0px;
  --slider-tack-height: 12px;
  --slider-track-width: 100px;
  --slider-handle-shadow-size: 0px;

  .slider-handle {
    background-color: rgb(var(--surface-rgb));
    transition: clip-path 150ms cubic-bezier(0.4, 0, 0.2, 1);
    cursor: ew-resize;

    &::before {
      content: '';
      clip-path: inset(0.2em round 4px);
      background-color: rgb(var(--primary-rgb));
      position: absolute;
      inset: 0;
      z-index: -1;
    }

    &:focus {
      --slider-handle-shadow-size: 0px;
    }

    &:hover {
      --slider-handle-shadow-size: 0px;

      &::before {
        clip-path: inset(0.225em round 4px);
      }
    }

    &:active {
      --slider-handle-shadow-size: 0px;

      &::before {
        clip-path: inset(0.25em round 4px);
      }
    }
  }
}
</style>
