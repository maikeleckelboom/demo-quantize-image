<script lang="ts" setup>
import type { SliderMark, SliderProps } from '~/modules/slider/types'
import { InputSlider } from '#components'
import InputSliderTicks from '~/components/Input/InputSliderTicks.vue'

const props = withDefaults(defineProps<SliderProps & { numberOfTicks?: number }>(), {
  numberOfTicks: 2
})

const { numberOfTicks, contained } = toRefs(props)

const isContained = computed(() => isTruthy(contained.value))
const { min, max, step } = useSteps(props)

const slider = ref<InstanceType<typeof InputSlider>>()

const modelValue = defineModel<number | number[]>({
  type: [Number, Array],
  default: 0
})

function generateLabelsFromNumber({
  min,
  max,
  numberOfTicks,
  decimalPlaces
}: {
  min: number
  max: number
  numberOfTicks: number
  decimalPlaces: number
}): SliderMark[] {
  const valueRange = max - min
  let spacing = valueRange / numberOfTicks
  let actualNumberOfLabels = Math.ceil(valueRange / spacing)
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
  return generateLabelsFromNumber({
    min: min.value,
    max: max.value,
    numberOfTicks: numberOfTicks.value,
    decimalPlaces: 0
  })
})
</script>

<template>
  <InputRangeSlider id="vm-slider" ref="slider" v-model="modelValue" v-bind="$props">
    <template #ticks>
      <InputSliderTicks v-model="modelValue" :ticks="ticks" />
    </template>
  </InputRangeSlider>

  <!--  <div class="relative flex flex-nowrap">-->
  <!--    <div-->
  <!--      v-for="(mark, i) in ticks"-->
  <!--      :key="`label-${i}`"-->
  <!--      :aria-hidden="true"-->
  <!--      :data-value="mark.value"-->
  <!--      :style="{-->
  <!--        left: `${mark.at * 100}%`,-->
  <!--        transform: `${getTickTranslateX(i, 20)} translateY(-50%)`-->
  <!--      }"-->
  <!--      class="text-body-xs absolute text-on-surface-variant"-->
  <!--    >-->
  <!--      {{ mark.label }}-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<style>
:root {
  --slider-handle-cursor: ew-resize;
}

#vm-slider {
  --slider-track-color: rgb(var(--primary-container-rgb));
  --slider-track-border-color: transparent;
  --slider-fill-color: rgb(var(--primary-rgb));
  --slider-handle-border-radius: 4px;

  --slider-horizontal-handle-width: 10px;
  --slider-horizontal-handle-height: 38px;
  --slider-horizontal-track-height: 8px;

  --slider-vertical-handle-width: 38px;
  --slider-vertical-track-width: 8px;
  --slider-vertical-track-height: 100%;

  &.v-horizontal {
    .slider-track {
    }
  }

  &.v-vertical {
    .slide-track {
    }
  }

  .slider-handle {
    --_duration: 100ms;
    background-color: rgb(var(--surface-rgb));
    transition:
      clip-path var(--_duration) var(--easing-standard-accelerate),
      background-color var(--_duration) var(--easing-standard-accelerate);

    &::before {
      content: '';
      clip-path: inset(0.2em round 3px);
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
        clip-path: inset(0.23em round 3px);
      }
    }

    &:active {
      --slider-handle-shadow-size: 0px;

      &::before {
        clip-path: inset(0.27em round 3px);
      }
    }
  }
}
</style>
