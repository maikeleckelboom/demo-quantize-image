<script lang="ts" setup>
import type { SliderProps } from '~/modules/slider/types'

const props = withDefaults(defineProps<SliderProps & { numberOfLabels?: number }>(), {
  numberOfLabels: 2
})

const { numberOfLabels, interval } = toRefs(props)

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

function generateLabelsFromNumber(
  min: number,
  max: number,
  numberOfLabels: number,
  decimalPlaces: number
): Label[] {
  const valueRange = max - min
  let spacing = valueRange / numberOfLabels
  let actualNumberOfLabels = Math.ceil(valueRange / spacing)
  const labels: Label[] = []
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

const marks = computed(() => {
  if (numberOfLabels.value < 1) return []
  return generateLabelsFromNumber(min.value, max.value, numberOfLabels.value, 0)
})

function isFirst(index: number) {
  return index === 0
}

function isLast(index: number) {
  return index === marks.value.length - 1
}

function isCurrent(index: number) {
  return marks.value[index].value === currentValue.value
}

function isPast(index: number) {
  return marks.value[index].value < currentValue.value
}

function isFuture(index: number) {
  return marks.value[index].value > currentValue.value
}

function getTickTranslateX(index: number, width: number = 4) {
  if (isFirst(index)) {
    return `translateX(${width * 0.5}px)`
  }
  if (isLast(index)) {
    return `translateX(${width * -2}px)`
  }
  return 'translateX(-50%)'
}
</script>

<template>
  <InputRangeSlider id="vm-slider" v-model="modelValue" disabled="true" v-bind="$props">
    <template #after>
      <div
        v-for="(mark, i) in marks"
        :key="i"
        :class="[
          'absolute top-1/2 size-[4px] rounded-full transition-transform duration-150',
          {
            'bg-primary-container': isCurrent(i) || isPast(i),
            'bg-primary': isFuture(i)
          }
        ]"
        :style="{
          left: `${mark.at * 100}%`,
          transform: `${getTickTranslateX(i)} translateY(-50%)`
        }"
      >
        <span class="sr-only">{{ mark.label }}</span>
      </div>
    </template>
  </InputRangeSlider>

  <!--  <div class="relative flex flex-nowrap">-->
  <!--    <div-->
  <!--      v-for="(mark, i) in marks"-->
  <!--      :key="`label-${i}`"-->
  <!--      :aria-hidden="true"-->
  <!--      :data-value="mark.value"-->
  <!--      :style="{-->
  <!--        left: `${mark.at * 100}%`,-->
  <!--        transform: `${getTickTranslateX(i, 8)} translateY(-50%)`-->
  <!--      }"-->
  <!--      class="text-body-xs absolute text-on-surface-variant"-->
  <!--      @click="onMarkClick(mark)"-->
  <!--    >-->
  <!--      {{ mark.label }}-->
  <!--    </div>-->
  <!--  </div>-->
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
    --_duration: 100ms;
    background-color: rgb(var(--surface-rgb));
    transition:
      clip-path var(--_duration) var(--easing-standard-accelerate),
      background-color var(--_duration) var(--easing-standard-accelerate);
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
