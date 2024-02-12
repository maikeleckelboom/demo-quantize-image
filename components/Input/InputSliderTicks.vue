<script lang="ts" setup>
import type { SliderMark, SliderProps } from '~/modules/slider/types'

const props = defineProps<{ ticks: SliderMark[]; contained?: SliderProps['contained'] }>()
const contained = computed(() => isTruthy(props.contained))

const { ticks } = toRefs(props)

const modelValue = defineModel<number | number[]>('modelValue', {
  type: [Number, Array],
  default: 0
})

const firstModelValue = computed(() => {
  if (Array.isArray(modelValue.value)) {
    return <number>modelValue.value.at(0)
  }
  return modelValue.value
})

function isFirst(index: number) {
  return index === 0
}

function isLast(index: number) {
  return index === ticks.value.length - 1
}

function isCurrent(index: number) {
  return ticks.value[index].value === firstModelValue.value
}

function isPast(index: number) {
  return ticks.value[index].value < firstModelValue.value
}

function isFuture(index: number) {
  return ticks.value[index].value > firstModelValue.value
}

function getTickTranslateX(index: number, width: number = 4) {
  if (!contained.value) {
    width = width / 2 + 0.5
  }
  if (isFirst(index)) {
    return `translateX(${width * 0.5}px)`
  }
  if (isLast(index)) {
    return `translateX(${width * -2}px)`
  }
  return 'translateX(-50%)'
}

const getTickStyle = (mark: SliderMark, index: number) => ({
  left: `${mark.at * 100}%`,
  transform: `${getTickTranslateX(index)} translateY(-50%)`
})
</script>
<template>
  <div>
    <div
      v-for="(mark, index) in ticks"
      :key="index"
      :class="[
        'absolute top-1/2 size-[4px] rounded-full transition-transform duration-150',
        {
          'bg-primary-container': isCurrent(index) || isPast(index),
          'bg-primary': isFuture(index)
        }
      ]"
      :style="getTickStyle(mark, index)"
    >
      <span class="sr-only">{{ mark.label }}</span>
    </div>
  </div>
</template>
