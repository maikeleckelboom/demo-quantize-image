<script lang="ts" setup>
import type { SliderMark, SliderProps } from '~/modules/slider/types'
import { InputSlider } from '#components'
import InputSliderTicks from '~/components/Input/SliderTicks.vue'

const props = withDefaults(defineProps<SliderProps & { numberOfTicks?: number }>(), {
  numberOfTicks: 2,
  min: 0,
  max: 100,
  oversized: true
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
  <InputRangeSlider
    ref="slider"
    v-bind="{
      ...props
    }"
  >
    <template #ticks>
      <InputSliderTicks
        v-model="modelValue"
        :btt="btt"
        :contained="contained"
        :dir="dir"
        :max="max"
        :min="min"
        :orientation="orientation"
        :ticks="ticks"
      />
    </template>
  </InputRangeSlider>
</template>
