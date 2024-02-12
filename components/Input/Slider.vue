<script lang="ts" setup>
import type { SliderMark, SliderProps } from '~/modules/slider/types'
import { InputSlider } from '#components'
import InputSliderTicks from '~/components/Input/InputSliderTicks.vue'

const props = withDefaults(defineProps<SliderProps & { numberOfTicks?: number }>(), {
  numberOfTicks: 2,
  min: 0,
  max: 100
})

const { numberOfTicks, contained } = toRefs(props)

const slider = ref<InstanceType<typeof InputSlider>>()

const modelValue = defineModel<number | number[]>({
  type: [Number, Array],
  default: 0
})

function generateLabelsFromNumber({
  min,
  max,
  count,
  decimalPlaces
}: {
  min: number
  max: number
  count: number
  decimalPlaces: number
}): SliderMark[] {
  const valueRange = max - min
  let spacing = valueRange / count
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
  const min = Number.isNaN(props.min) ? 0 : Number(props.min)
  const max = Number.isNaN(props.max) ? 100 : Number(props.max)
  const count = Math.max(1, numberOfTicks.value)
  return generateLabelsFromNumber({ min, max, count, decimalPlaces: 0 })
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

  --slider-vertical-width: 10px;
  --slider-vertical-height: 200px;
  --slider-handle-cursor: ns-resize;

  &.v-horizontal {
    --slider-handle-width: 10px;
    --slider-handle-height: 38px;
  }

  &.v-vertical {
    --slider-handle-width: 38px;
    --slider-handle-height: 10px;

    /** todo: **/
    /*
     */
  }

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
        clip-path: inset(0.23em round 3px);
      }
    }

    &:active,
    &:focus {
      &::before {
        clip-path: inset(0.27em round 3px);
      }
    }
  }

  &.v-swiping {
    transition: none;

    .slider-handle {
      transition: none;

      &::before {
        clip-path: inset(0.27em round 3px);
      }
    }
  }
}
</style>
