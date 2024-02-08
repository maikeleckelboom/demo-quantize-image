<script lang="ts" setup>
import type { SliderProps } from '~/modules/slider/types'

const modelValue = defineModel<number>('modelValue', { type: Number, default: 0 })

const container = ref<HTMLElement>()

const props = defineProps<SliderProps>()

const min = ref(Number(props.min || 0))
const max = ref(Number(props.max || 100))

const generateLabels = () => {
  const labels = []
  const divisor = getDivisor(max.value, min.value)
  for (let i = min.value; i <= max.value; i += divisor) {
    labels.push(i)
  }
  return labels
}

function getDivisor(max: number, min = 0) {
  return max - min > 100 ? 10 : 1
}

const labels = computed(() => {
  return generateLabels()
})
</script>

<template>
  <div>
    <InputRangeSlider v-model="modelValue" v-bind="$props" />
  </div>
</template>

<style scoped>
.label-el {
  position: absolute;

  &:not(:first-child, :last-child) {
    transform: translateX(-50%);
  }
}
</style>
