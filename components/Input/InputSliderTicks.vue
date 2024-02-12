<script lang="ts" setup>
import type { SliderMark, SliderProps } from '~/modules/slider/types'

interface Props extends Partial<Pick<SliderProps, 'orientation' | 'contained' | 'btt' | 'dir'>> {
  ticks: SliderMark[]
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal'
})

const rtl = computed(() => props.dir === 'rtl')
const btt = computed(() => isTruthy(props.btt))
const contained = computed(() => isTruthy(props.contained))
const vertical = computed(() => props.orientation === 'vertical')

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

function getTickTranslate(index: number, size: number = 4) {
  if (!contained.value) {
    size = size / 2 + 0.25
  }

  const c = unref(contained)

  if (isFirst(index)) {
    return vertical.value
      ? `translateX(-50%) translateY(${size * 0.5}px)`
      : `translateX(${size * 0.5}px) translateY(-50%)`
  }
  if (isLast(index)) {
    return vertical.value
      ? `translateX(-50%) translateY(${size * -2.5}px)`
      : `translateX(${size * -2.25}px) translateY(-50%)`
  }
  return 'translateX(-50%) translateY(-50%)'
}

const getTickStyle = (mark: SliderMark, index: number) => {
  const isVertical = unref(vertical)
  if (isVertical) {
    return {
      left: '50%',
      top: `${mark.at * 100}%`,
      transform: getTickTranslate(index)
    }
  } else {
    return {
      top: '50%',
      left: `${mark.at * 100}%`,
      transform: getTickTranslate(index)
    }
  }
}
</script>
<template>
  <div>
    <div
      v-for="(mark, index) in ticks"
      :key="index"
      :class="[
        'absolute size-[4px] rounded-full transition-transform duration-150',
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
