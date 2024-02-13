<script lang="ts" setup>
const modelValue = defineModel<number | number[]>()
</script>

<template>
  <InputRangeSlider v-model="modelValue" class="v-material-slider" />
</template>

<style>
.v-material-slider {
  --slider-track-background-color: rgb(var(--primary-container-rgb));
  --slider-fill-color: rgb(var(--primary-rgb));
  --slider-handle-width--horizontal: 12px;
  --slider-handle-height--horizontal: 50px;
  --slider-handle-width--vertical: 48px;
  --slider-handle-height--vertical: 12px;
  --slider-handle-border: solid 1px inherit;
  --slider-handle-border-radius: 4px;

  --slider-horizontal-track-height: 12px;
  --slider-vertical-track-width: 12px;
  --slider-track-height: 12px;
  --slider-track-width: 100px;

  .slider-handle {
    background-color: rgb(var(--surface-rgb));
    transition: clip-path 150ms cubic-bezier(0.4, 0, 0.2, 1);

    &::before {
      content: '';
      clip-path: inset(4px round 4px);
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
        clip-path: inset(0.3rem round 4px);
      }
    }

    &:active {
      --slider-handle-shadow-size: 0px;

      &::before {
        clip-path: inset(0.325rem round 4px);
      }
    }
  }
}
</style>
