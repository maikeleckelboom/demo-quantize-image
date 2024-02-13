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

const getTickStyle = (mark: SliderMark) => {
  return {
    [unref(vertical) ? 'top' : 'left']: unref(toReversed)
      ? `${(1 - mark.at) * 100}%`
      : `${mark.at * 100}%`
  }
}

const isTickActive = (index: number) => {
  return isCurrent(index) || isPast(index)
}

const isTickInactive = (index: number) => {
  return isFuture(index)
}
</script>
<template>
  <div
    v-for="(mark, index) in ticks"
    :key="index"
    :class="[isTickActive(index) ? 'v-active' : 'v-inactive']"
    :style="getTickStyle(mark)"
    class="input-tick-mark text-xs"
  >
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs leading-none">
      <slot :index="index" :mark="mark" name="tick" />
    </div>
    <span class="sr-only">{{ mark.label }}</span>
  </div>
</template>

<style lang="postcss">
.input-tick-mark {
  --_size: var(--slider-tick-size, 4px);
  --_radius: var(--slider-tick-border-radius, 50%);
  --_active-color: var(--slider-tick-active-color, rgb(var(--primary-container-rgb)));
  --_inactive-color: var(--slider-tick-inactive-color, rgb(var(--primary-rgb)));
  --_disabled-color: var(--slider-tick-disabled-color, rgb(var(--on-surface-rgb)));
  --_background-color: var(--_inactive-color);

  position: absolute;
  width: var(--_size);
  height: var(--_size);
  border-radius: var(--_radius);
  background: var(--_background-color);
  z-index: 1;

  &.v-active {
    --_background-color: var(--slider-tick-active-color);
  }

  &.v-inactive {
    --_background-color: var(--slider-tick-inactive-color);
  }

  /* Touching the left/top edge */
  --edge-start: calc(50% - (var(--_size) * 0.5));
  /* Touching the right/bottom edge */
  --edge-end: calc(-150% + (var(--_size) * 0.5));
  /* Half of the size as offset */
  --edge-offset: calc(var(--_size) * 0.5);
  /* total offset when is contained */
  --edge-contained-offset: calc(var(--_size) * 2);
}

.v-horizontal {
  .input-tick-mark {
    top: 50%;
    transform: translateY(-50%);
  }

  &.v-ltr {
    .input-tick-mark {
      &:first-child {
        transform: translateX(calc(var(--edge-start) + var(--edge-offset))) translateY(-50%);
      }

      &:last-child {
        transform: translateX(calc(var(--edge-end) - var(--edge-offset))) translateY(-50%);
      }
    }

    &.v-contained {
      .input-tick-mark {
        &:first-child {
          transform: translateX(calc(var(--edge-start) + var(--edge-contained-offset))) translateY(-50%);
        }

        &:last-child {
          transform: translateX(calc(var(--edge-end) - var(--edge-contained-offset))) translateY(-50%);
        }
      }
    }
  }

  &.v-rtl {
    .input-tick-mark {
      &:first-child {
        transform: translateX(calc(var(--edge-end) - var(--edge-offset))) translateY(-50%);
      }

      &:last-child {
        transform: translateX(calc(var(--edge-start) + var(--edge-offset))) translateY(-50%);
      }
    }

    &.v-contained {
      .input-tick-mark {
        &:first-child {
          transform: translateX(calc(var(--edge-end) - var(--edge-contained-offset))) translateY(-50%);
        }

        &:last-child {
          transform: translateX(calc(var(--edge-start) + var(--edge-contained-offset))) translateY(-50%);
        }
      }
    }
  }
}

.v-vertical {
  .input-tick-mark {
    left: 50%;
    transform: translateX(-50%);
  }

  &.v-ttb {
    .input-tick-mark {
      &:first-child {
        transform: translateY(calc(var(--edge-start) + var(--edge-offset))) translateX(-50%);
      }

      &:last-child {
        transform: translateY(calc(var(--edge-end) - var(--edge-offset))) translateX(-50%);
      }
    }

    &.v-contained {
      .input-tick-mark {
        &:first-child {
          transform: translateY(calc(var(--edge-start) + var(--edge-contained-offset))) translateX(-50%);
        }

        &:last-child {
          transform: translateY(calc(var(--edge-end) - var(--edge-contained-offset))) translateX(-50%);
        }
      }
    }
  }

  &.v-btt {
    .input-tick-mark {
      &:first-child {
        transform: translateY(calc(var(--edge-end) - var(--edge-offset))) translateX(-50%);
      }

      &:last-child {
        transform: translateY(calc(var(--edge-start) + var(--edge-offset))) translateX(-50%);
      }
    }

    &.v-contained {
      .input-tick-mark {
        &:first-child {
          transform: translateY(calc(var(--edge-end) - var(--edge-contained-offset))) translateX(-50%);
        }

        &:last-child {
          transform: translateY(calc(var(--edge-start) + var(--edge-contained-offset))) translateX(-50%);
        }
      }
    }
  }
}
</style>
