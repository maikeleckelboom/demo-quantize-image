<script lang="ts" setup>
import type { SliderMark } from '~/modules/slider/types'

const props = defineProps<{ ticks: SliderMark[]; contained?: boolean }>()

const { ticks, contained } = toRefs(props)

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
</script>
<template>
  <div
    v-for="(mark, i) in ticks"
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
