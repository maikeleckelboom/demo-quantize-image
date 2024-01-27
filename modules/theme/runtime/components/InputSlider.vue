<script lang="ts" setup>
import InputRangeSlider from "~/modules/input-slider/runtime/InputRangeSlider.vue";

const modelValue = defineModel<number | number[]>()
</script>

<template>
  <InputRangeSlider v-model="modelValue" class="my-custom-slider">
    <template #after>
      <slot name="trailing"/>
    </template>
  </InputRangeSlider>
</template>

<style>
.my-custom-slider {
  --slider-track-color: rgb(var(--primary-container-rgb));
  --slider-track-border-color: transparent;
  --slider-fill-color: rgb(var(--primary-rgb));
  --slider-thumb-border-radius: 4px;
  --slider-horizontal-thumb-width: 12px;
  --slider-horizontal-thumb-height: 44px;
  --slider-vertical-thumb-width: 44px;
  --slider-vertical-thumb-height: 12px;

  --slider-thumb-shadow-size: 0px;

  --slider-track-border: 0px;


  .slider-handle {
    background-color: rgb(var(--surface-rgb));

    transition: clip-path 160ms ease-out;

    &::before {
      content: '';
      clip-path: inset(0.28em round 2px);
      background-color: rgb(var(--primary-rgb));

      position: absolute;
      inset: 0;
      z-index: -1;
    }

    &:focus {
      --slider-thumb-shadow-size: 0px;
    }

    &:hover {
      --slider-thumb-shadow-size: 0px;

      &::before {
        clip-path: inset(0.38em round 2px);
      }
    }

    &:active {
      --slider-thumb-shadow-size: 0px;

      &::before {
        clip-path: inset(0.25em round 2px);
      }
    }
  }
}
</style>
