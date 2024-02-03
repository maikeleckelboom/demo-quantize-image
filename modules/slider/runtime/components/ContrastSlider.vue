<script lang="ts" setup>
import { twMerge } from 'tailwind-merge'
import type { Ref } from 'vue'

const modelValue = defineModel() as Ref<number | number[]>

type Mark = {
  value: number
  label: string
  offset?: number
}

const marks: Mark[] = [
  { value: -1, label: 'Reduced' },
  { value: 0, label: 'Low' },
  { value: 0.5, label: 'Medium' },
  { value: 1, label: 'High' }
]

function calculateOffset(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100
}

function getOffset(mark: Mark) {
  return calculateOffset(mark.value, -1, 1)
}

const computedMarks = computed(() =>
  marks.map((mark) => {
    mark.offset = getOffset(mark)
    return mark
  })
)

function onMarkClick(mark: Mark) {
  modelValue.value = mark.value
}
</script>

<template>
  <div class="mt-4 rounded-md">
    <fieldset class="grid grid-cols-[auto,1fr,auto] gap-y-2 rounded-md pb-0 pt-4">
      <div class="col-span-full flex w-full items-center">
        <InputRangeSlider
          v-model="modelValue"
          :snap-values="marks.map((mark) => mark.value)"
          class="v-contrast-slider"
          contained="false"
          max="1"
          min="-1"
          step="0.1"
        />
      </div>
      <div class="relative col-span-full flex h-[38px] items-start justify-start">
        <div
          v-for="(mark, idx) in computedMarks"
          :key="mark.value"
          :class="
            twMerge([
              'absolute flex flex-col items-center justify-center',
              'hover:opacity-80 active:opacity-90',
              '-translate-x-1/2'
            ])
          "
          :style="{ left: `${mark.offset}%` }"
          class="mark"
          @click="onMarkClick(mark)"
        >
          <span class="h-2 w-1 rounded-lg bg-outline" />
          <span
            :class="{
              'ml-[50%]': idx === 0,
              'mr-[50%]': idx === computedMarks.length - 1
            }"
            class="mt-2.5 flex flex-col items-center justify-center gap-1.5 text-label-sm font-medium leading-none text-outline"
          >
            <span>{{ mark.label }}</span>
          </span>
        </div>
      </div>
    </fieldset>
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
