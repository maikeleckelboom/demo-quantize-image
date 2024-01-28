<script lang="ts" setup>
const modelValue = defineModel<number | number[]>()
</script>

<template>
  <Slider v-model="modelValue" class="v-material-slider" />
</template>

<style>
.v-material-slider {
  --slider-track-color: rgb(var(--primary-container-rgb));
  --slider-track-border-color: transparent;
  --slider-fill-color: rgb(var(--primary-rgb));
  --slider-handle-border-radius: 4px;
  --slider-horizontal-handle-width: 12px;
  --slider-horizontal-handle-height: 50px;
  --slider-vertical-handle-width: 48px;
  --slider-vertical-handle-height: 12px;
  --slider-handle-shadow-size: 0px;
  --slider-track-border: 0px;
  --slider-horizontal-height: 12px;
  --slider-vertical-width: 12px;

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
        clip-path: inset(0.285rem round 4px);
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
