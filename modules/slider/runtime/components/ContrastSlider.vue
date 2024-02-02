<script lang="ts" setup>
import { twMerge } from 'tailwind-merge'

const modelValue = defineModel<number | number[]>()

type Mark = {
  value: number
  label: string
  icon: string
}

const marks = ref<Mark[]>([
  { value: 0, label: 'Low', icon: 'ic:baseline-brightness-low' },
  { value: 0.5, label: 'Medium', icon: 'ic:baseline-brightness-medium' },
  { value: 1, label: 'High', icon: 'ic:baseline-brightness-high' }
])

function onMarkClick(mark: Mark) {
  console.log('mark clicked', mark)
  modelValue.value = mark.value
}
</script>

<template>
  <div class="grid grid-cols-[auto,1fr,auto] gap-y-2">
    <div class="col-span-full">
      <label class="text-label-lg"> Contrast Level </label>
      <p class="text-sm leading-loose text-on-surface-variant">
        The difference in brightness between the fore- and background.
      </p>
    </div>
    <div class="col-span-full flex w-full items-center">
      <InputRangeSlider v-model="modelValue" class="v-contrast-slider" max="1" min="0" step="0.1" />
    </div>
    <div class="col-span-full flex w-full justify-between">
      <button
        v-for="mark in marks"
        :key="mark.value"
        :class="
          twMerge([
            'relative flex flex-col items-center justify-center',
            'first-of-type:left-1.5 first-of-type:-translate-x-1/2',
            'last-of-type:right-1.5 last-of-type:translate-x-1/2',
            'filter hover:hue-rotate-0',
            'transition duration-200 ease-linear'
          ])
        "
        @click="onMarkClick(mark)"
      >
        <span class="h-3 w-1 rounded-lg bg-outline" />
        <span class="mt-2.5 text-label-sm font-medium leading-none text-outline">{{ mark.label }}</span>
      </button>
    </div>
  </div>
</template>

<style>
.v-contrast-slider {
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
