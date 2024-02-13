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

const toReversed = computed(() => {
  return unref(rtl) || (unref(btt) && unref(vertical))
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

const getTickStyle = (mark: SliderMark, index: number) => {
  if (unref(vertical)) {
    return {
      top: unref(toReversed) ? `${(1 - mark.at) * 100}%` : `${mark.at * 100}%`
    }
  }
  return {
    left: unref(toReversed) ? `${(1 - mark.at) * 100}%` : `${mark.at * 100}%`
  }
}
</script>
<template>
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
    class="input-tick-mark text-xs"
  >
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs leading-none">
      <slot :index="index" :mark="mark" name="tick" />
    </div>
    <span class="sr-only">{{ mark.label }}</span>
  </div>
</template>

<style lang="postcss">
:root {
  --slider-tick-size: 4px;
}

.input-tick-mark {
  /*
  transform: translateX(-50%) translateY(-50%);
  */

  /*  &:first-child {
      transform: translateX(50%) translateY(-50%);
    }

    &:last-child {
      transform: translateX(-150%) translateY(-50%);
    }*/
}

/*
  Horizontal - ltr/rtl/contained
*/
.v-horizontal {
  .input-tick-mark {
    top: 50%;
    transform: translateY(-50%);
  }

  &.v-ltr {
    .input-tick-mark {
      &:first-child {
        /* Touching the left edge */
        transform: translateX(calc(50% - (var(--slider-tick-size) * 0.5))) translateY(-50%);
      }

      &:last-child {
        /* Touching the right edge */
        transform: translateX(calc(-150% + (var(--slider-tick-size) * 0.5))) translateY(-50%);
      }
    }
  }

  &.v-rtl {
    .input-tick-mark {
      &:first-child {
        /* Touching the right edge */
        transform: translateX(calc(-150% + (var(--slider-tick-size) * 0.5))) translateY(-50%);
      }

      &:last-child {
        /* Touching the left edge */
        transform: translateX(calc(50% - (var(--slider-tick-size) * 0.5))) translateY(-50%);
      }
    }
  }

  &.v-contained {
  }
}

/*
  Vertical - ttb/btt/contained
*/
.v-vertical {
  .input-tick-mark {
    left: 50%;
    transform: translateX(-50%);
  }

  &.v-ttb {
    .input-tick-mark {
      &:first-child {
        /* Touching the top edge */
        transform: translateY(calc(50% - (var(--slider-tick-size) * 0.5))) translateX(-50%);
      }

      &:last-child {
        /* Touching the bottom edge */
        transform: translateY(calc(-150% + (var(--slider-tick-size) * 0.5))) translateX(-50%);
      }
    }
  }

  &.v-btt {
    .input-tick-mark {
      &:first-child {
        /* Touching the bottom edge */
        transform: translateY(calc(-150% + (var(--slider-tick-size) * 0.5))) translateX(-50%);
      }

      &:last-child {
        /* Touching the top edge */
        transform: translateY(calc(50% - (var(--slider-tick-size) * 0.5))) translateX(-50%);
      }
    }
  }

  &.v-contained {
  }
}
</style>
