<script lang="ts" setup>
import type { SliderMark, SliderProps } from '~/modules/slider/types'
import { InputSlider } from '#components'
import InputSliderTicks from '~/modules/slider/runtime/components/SliderTicks.vue'

const props = withDefaults(defineProps<SliderProps & { numberOfTicks?: number }>(), {
  numberOfTicks: 2,
  min: 0,
  max: 100
})

const { numberOfTicks } = toRefs(props)

const slider = ref<InstanceType<typeof InputSlider>>()

const modelValue = defineModel<number | number[]>({
  type: [Number, Array],
  default: 0
})

type LabelGenerateOptions = {
  min: number
  max: number
  count: number
  decimalPlaces: number
}

function generateLabelsFromNumber({
  min,
  max,
  count,
  decimalPlaces
}: LabelGenerateOptions): SliderMark[] {
  const valueRange = max - min
  const spacing = valueRange / count
  const actualNumberOfLabels = Math.ceil(valueRange / spacing)
  const labels: SliderMark[] = []
  for (let i = 0; i <= actualNumberOfLabels; i++) {
    let labelValue = min + i * spacing
    labelValue = parseFloat(labelValue.toFixed(decimalPlaces))
    labels.push({
      at: (labelValue - min) / valueRange,
      value: labelValue,
      label: labelValue.toString()
    })
  }
  return labels
}

const ticks = computed(() => {
  if (numberOfTicks.value < 1) return []
  const min = Number.isNaN(props.min) ? 0 : Number(props.min)
  const max = Number.isNaN(props.max) ? 100 : Number(props.max)
  const count = Math.max(1, numberOfTicks.value)
  return generateLabelsFromNumber({ min, max, count, decimalPlaces: 0 })
})
</script>

<template>
  <InputRangeSlider ref="slider" v-model="modelValue" class="app-slider" v-bind="$props">
    <template #ticks>
      <InputSliderTicks
        v-model="modelValue"
        :btt="btt"
        :contained="contained"
        :dir="dir"
        :orientation="orientation"
        :ticks="ticks"
      />
    </template>
  </InputRangeSlider>
</template>

<style>
.app-slider {
  --slider-track-background-color: rgb(var(--primary-container-rgb));
  --slider-track-border-color: transparent;
  --slider-fill-background-color: rgb(var(--primary-rgb));
  --slider-handle-border-radius: 4px;

  /* todo: fix horizontal/vertical config mess */
  --slider-track-width--horizontal: 200px;
  --slider-track-height--vertical: 200px;
  --slider-track-width--vertical: 8px;
  --slider-track-height--horizontal: 8px;

  --slider-handle-height--vertical: 10px;
  --slider-handle-width--horizontal: 10px;
  --slider-handle-height--horizontal: 38px;
  --slider-handle-width--vertical: 38px;
  --slider-handle-cursor--horizontal: ew-resize;
  --slider-handle-cursor--vertical: ns-resize;

  .slider-handle {
    background-color: rgb(var(--surface-rgb));

    &::before {
      content: '';
      clip-path: inset(0.2em round 3px);
      background-color: rgb(var(--primary-rgb));
      position: absolute;
      inset: 0;
      z-index: -1;
    }

    &:hover {
      &::before {
        clip-path: inset(0.24em round 3px);
      }
    }

    &:is(:exactactive, :focus-visible, .v-swiping &) {
      &::before {
        clip-path: inset(0.28em round 3px);
      }
    }
  }
}
</style>
