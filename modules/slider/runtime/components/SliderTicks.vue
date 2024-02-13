<script lang="ts" setup>
import type { SliderMark, SliderProps } from '~/modules/slider/types'

interface Props extends Partial<Pick<SliderProps, 'orientation' | 'btt' | 'dir' | 'min' | 'max'>> {
  ticks: SliderMark[]
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  btt: false,
  dir: 'ltr',
  min: 0,
  max: 100
})

const { ticks } = toRefs(props)
const rtl = computed(() => props.dir === 'rtl')
const btt = computed(() => isTruthy(props.btt))
const vertical = computed(() => props.orientation === 'vertical')

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

function isCurrent(index: number) {
  return ticks.value[index].value === firstModelValue.value
}

function isPast(index: number) {
  return ticks.value[index].value < firstModelValue.value
}

function isFuture(index: number) {
  return ticks.value[index].value > firstModelValue.value
}

const isTickActive = (index: number) => {
  return isCurrent(index) || isPast(index)
}

const getTickStyle = (mark: SliderMark) => ({
  [unref(vertical) ? 'top' : 'left']: unref(toReversed)
    ? `${(1 - mark.at) * 100}%`
    : `${mark.at * 100}%`
})
</script>

<template>
  <div>
    <div
      v-for="(mark, index) in ticks"
      :key="index"
      :class="isTickActive(index) ? 'v-active' : 'v-inactive'"
      :style="getTickStyle(mark)"
      class="input-tick-mark"
    >
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs leading-none">
        <slot :index="index" :mark="mark" name="tick" />
      </div>
      <span class="sr-only">{{ mark.label }}</span>
    </div>
  </div>
</template>

<style lang="postcss">
.input-tick-mark {
  --_size: var(--slider-tick-size, 4px);
  --_radius: var(--slider-tick-border-radius, 50%);
  --_active-color: var(--slider-tick-active-color, rgb(var(--primary-container-rgb)));
  --_inactive-color: var(--slider-tick-inactive-color, rgb(var(--primary-rgb)));
  --_disabled-color: var(--slider-tick-disabled-color, rgb(var(--on-surface-rgb)));

  &.v-inactive {
    --_background-color: var(--_inactive-color);
  }

  &.v-active {
    --_background-color: var(--_active-color);
  }

  --boundary-start: calc(50% - (var(--_size) * 1));
  --boundary-end: calc(-150% + (var(--_size) * 1));
  --boundary-offset: calc(var(--_size) * 0.5);
  --boundary-offset-contained: calc(var(--_size) * 2);

  position: absolute;
  inline-size: var(--_size);
  block-size: var(--_size);
  border-radius: var(--_radius);
  background: var(--_background-color);
  z-index: 1;
}

.v-horizontal {
  .input-tick-mark {
    top: 50%;
    transform: translateY(-50%);
  }

  &.v-ltr {
    .input-tick-mark {
      &:first-child {
        transform: translateX(calc(var(--boundary-start) + var(--boundary-offset))) translateY(-50%);
      }

      &:last-child {
        transform: translateX(calc(var(--boundary-end) - var(--boundary-offset))) translateY(-50%);
      }
    }

    &.v-contained {
      .input-tick-mark {
        &:first-child {
          transform: translateX(calc(var(--boundary-start) + var(--boundary-offset-contained)))
            translateY(-50%);
        }

        &:last-child {
          transform: translateX(calc(var(--boundary-end) - var(--boundary-offset-contained)))
            translateY(-50%);
        }
      }
    }
  }

  &.v-rtl {
    .input-tick-mark {
      &:first-child {
        transform: translateX(calc(var(--boundary-end) - var(--boundary-offset))) translateY(-50%);
      }

      &:last-child {
        transform: translateX(calc(var(--boundary-start) + var(--boundary-offset))) translateY(-50%);
      }
    }

    &.v-contained {
      .input-tick-mark {
        &:first-child {
          transform: translateX(calc(var(--boundary-end) - var(--boundary-offset-contained)))
            translateY(-50%);
        }

        &:last-child {
          transform: translateX(calc(var(--boundary-start) + var(--boundary-offset-contained)))
            translateY(-50%);
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
        transform: translateY(calc(var(--boundary-start) + var(--boundary-offset))) translateX(-50%);
      }

      &:last-child {
        transform: translateY(calc(var(--boundary-end) - var(--boundary-offset))) translateX(-50%);
      }
    }

    &.v-contained {
      .input-tick-mark {
        &:first-child {
          transform: translateY(calc(var(--boundary-start) + var(--boundary-offset-contained)))
            translateX(-50%);
        }

        &:last-child {
          transform: translateY(calc(var(--boundary-end) - var(--boundary-offset-contained)))
            translateX(-50%);
        }
      }
    }
  }

  &.v-btt {
    .input-tick-mark {
      &:first-child {
        transform: translateY(calc(var(--boundary-end) - var(--boundary-offset))) translateX(-50%);
      }

      &:last-child {
        transform: translateY(calc(var(--boundary-start) + var(--boundary-offset))) translateX(-50%);
      }
    }

    &.v-contained {
      .input-tick-mark {
        &:first-child {
          transform: translateY(calc(var(--boundary-end) - var(--boundary-offset-contained)))
            translateX(-50%);
        }

        &:last-child {
          transform: translateY(calc(var(--boundary-start) + var(--boundary-offset-contained)))
            translateX(-50%);
        }
      }
    }
  }
}
</style>
