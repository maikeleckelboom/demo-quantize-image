<script lang="ts" setup>
import type { SliderProps } from '~/modules/slider/types'

const props = defineProps<SliderProps>()

const { min, max, step } = useSteps(props)

const modelValue = defineModel<number | number[]>({
  type: [Number, Array],
  default: 0
})

const currentValue = computed(() => {
  if (Array.isArray(modelValue.value)) {
    return <number>modelValue.value.at(0)
  }
  return modelValue.value
})
type Label = {
  at: number
  value: number
  label: string
}

function generateSliderLabels(
  customMin: number,
  customMax: number,
  desiredNumberOfLabels: number,
  decimalPlaces: number
): Label[] {
  const valueRange = customMax - customMin

  // Calculate spacing between labels
  let spacing = valueRange / desiredNumberOfLabels

  // Adjust spacing to fit within the slider width if necessary
  spacing = Math.max(spacing, 1) // Adjust this value as needed

  // Calculate the number of labels
  const actualNumberOfLabels = Math.ceil(valueRange / spacing)

  // Generate labels
  const labels: Label[] = []
  for (let i = 0; i <= actualNumberOfLabels; i++) {
    let labelValue = customMin + i * spacing
    labelValue = parseFloat(labelValue.toFixed(decimalPlaces)) // Round to specified decimal places
    labels.push({
      at: (labelValue - customMin) / valueRange,
      value: labelValue,
      label: labelValue.toString()
    })
  }

  return labels
}

const marks = computed(() => {
  const customMin = min.value
  const customMax = max.value
  const desiredNumberOfLabels = 10
  return generateSliderLabels(customMin, customMax, desiredNumberOfLabels, 0)
})
</script>

<template>
  <InputRangeSlider id="vm-slider" v-model="modelValue" v-bind="$props" />
  <div class="relative flex flex-nowrap">
    <div
      v-for="(mark, idx) in marks"
      :key="idx"
      :aria-hidden="true"
      :data-value="mark.value"
      :style="{
        left: `${mark.at * 100}%`,
        transform: 'translateX(-50%)'
      }"
      class="text-body-xs absolute text-on-surface-variant"
    >
      {{ mark.label }}
    </div>
  </div>
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

  width: 100%;

  .slider-track {
    width: 100%;
  }

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
