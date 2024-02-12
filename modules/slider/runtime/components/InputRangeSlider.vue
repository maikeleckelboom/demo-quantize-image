<script lang="ts" setup>
import { type SliderProps } from '~/modules/slider/types'
import { type Position, useTemplateRefsList } from '@vueuse/core'
import { snap } from 'popmotion'

const props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  dir: 'ltr',
  btt: false,
  orientation: 'horizontal',
  contained: true,
  step: 1,
  labelVisibility: 'auto'
})

defineSlots<{
  default: void
  before: void
  ticks: void
  track(): void
  handle(): void
  labelText(): void
}>()

const getRect = (el: HTMLElement) => el.getBoundingClientRect()

const isRtl = computed(() => {
  return ['rtl', 'ltr'].includes(props.dir)
    ? props.dir === 'rtl'
    : getComputedStyle(document.documentElement).direction === 'rtl'
})

const isBtt = computed(() => {
  if (!isVertical.value) {
    return false
  }
  return isTruthy(props.btt)
})

const isVertical = computed(() => props.orientation === 'vertical')
const isContained = computed(() => isTruthy(props.contained))
const isDisabled = computed(() => isTruthy(props.disabled))

const modelValue = defineModel<number | number[]>()

const modelValueProgress = computed(() => {
  let returnValue = [0]

  if (isNumber(modelValue.value)) {
    returnValue = [getProgress(modelValue.value)]
  } else if (isArray(modelValue.value)) {
    returnValue = modelValue.value.map(getProgress)
  }

  return returnValue
})

const rootRef = ref<HTMLElement>()
const sliderRef = ref<HTMLElement>()
const handlesRef = useTemplateRefsList<HTMLElement>()

const currentHandle = ref<HTMLElement | null>(null)
watch(currentHandle, (pointer) => pointer?.focus())

let clickOffset: Position = { x: 0, y: 0 }

function setClickOffset(evt: PointerEvent) {
  clickOffset = { x: 0, y: 0 }
  const clickedHandle = getClickedHandle(evt)
  if (clickedHandle) {
    const pointerRect = getRect(clickedHandle)
    const distanceFromPointerCenter = getDistanceToCenter(pointerRect, posEnd)
    clickOffset = {
      x: isVertical.value ? 0 : distanceFromPointerCenter,
      y: isVertical.value ? distanceFromPointerCenter : 0
    }
  }
}

function getValueAtStep(value: number, step: number) {
  const closestStep = Math.round(value / step) * step
  return getClosestSnapValue(closestStep)
}

function convertRange(min: number, max: number, a: number, b: number, x: number) {
  const range = max - min
  if (range === 0) return a
  return ((b - a) * (x - min)) / range + a
}

function getValue(progress: number) {
  const min = Number(props.min)
  const max = Number(props.max)
  const value = convertRange(0, 100, min, max, progress)
  const stepValue = getClosestSnapValue(value)
  return clamp(stepValue, min, max)
}

function getProgress(value: number) {
  const min = Number(props.min)
  const max = Number(props.max)
  const range = convertRange(min, max, 0, 100, value)
  return clamp(range, 0, 100)
}

function getProgressFromEvent(event: PointerEvent) {
  const sliderEl = unrefElement(sliderRef)
  const sliderRect = getRect(<HTMLElement>sliderEl)
  return calculateProgress(sliderRect, {
    x: event.clientX,
    y: event.clientY
  })
}

function calculateStepsArray(min: number, max: number, step: number) {
  const steps = []
  for (let i = min; i <= max; i += step) {
    steps.push(i)
  }
  return steps
}

function getSteps(): number[] {
  const min = Number(props.min)
  const max = Number(props.max)
  const step = Number(props.step)
  return calculateStepsArray(min, max, step)
}

function getClosestSnapValue(value: number) {
  if (props.step === 'any') {
    return value
  }
  const step = Number(props.step)
  const interval = getSteps()
  const closest = snap(interval)(value)
  return Math.round(closest / step) * step
}

const { isSwiping, posEnd } = usePointerSwipe(rootRef, {
  threshold: 0,
  disableTextSelect: true,
  onSwipeStart: (event) => {
    if (isDisabled.value) return
    event.preventDefault()
    currentHandle.value = getClosestHandle(event)
    setClickOffset(event)
    handleSwipe(event)
  },
  onSwipe: (event) => {
    if (isDisabled.value) return
    handleSwipe(event)
  },
  onSwipeEnd: (event, direction) => {
    if (isDisabled.value) return
    const removePointer = () => (currentHandle.value = null)
    removePointer()
  }
})

function getClosestHandle(event: PointerEvent): HTMLElement {
  const progress = getProgressFromEvent(event)
  const getDistance = (v: number) => Math.abs(v - progress)
  const distances = unref(modelValueProgress).filter(Number.isNaN).map(getDistance)
  const minDistance = Math.min(...distances)
  const index = distances.indexOf(minDistance)
  return handlesRef.value[index]
}

function getClickedHandle(evt: PointerEvent) {
  return handlesRef.value.find((el) => el.contains(<Node>evt.target))
}

function getDistanceToCenter(rect: DOMRect, { x, y }: Position) {
  const center = isVertical.value ? rect.top + rect.height / 2 : rect.left + rect.width / 2
  return isVertical.value ? y - center : x - center
}

function getToReversed() {
  const isHorizontalAndRtl = !isVertical.value && isRtl.value
  const isVerticalAndBtt = isVertical.value && isBtt.value
  return isHorizontalAndRtl || isVerticalAndBtt
}

function calculateProgress(
  parentRect: DOMRect,
  endPos: Position,
  offsetPos: Position = { x: 0, y: 0 }
) {
  const isV = unref(isVertical)
  const horizontal = isV ? 'top' : 'left'
  const vertical = isV ? 'bottom' : 'right'
  const xy = isV ? 'y' : 'x'
  const min = parentRect[horizontal] + offsetPos[xy]
  const max = parentRect[vertical] + offsetPos[xy]
  const range = convertRange(min, max, 0, 100, endPos[xy])
  const toReversed = getToReversed()
  return toReversed ? 100 - range : range
}

const handleWidthVar = useCssVar('--slider-handle-width', rootRef, {
  observe: true
})

const handleHeightVar = useCssVar('--slider-handle-height', rootRef, {
  observe: true
})

function getHandleSize() {
  return parseInt(unref(isVertical) ? unref(handleHeightVar) : unref(handleWidthVar))
}

function getContainedRect(rect: DOMRect) {
  const handleSize = getHandleSize()
  return {
    ...rect,
    top: rect.top + handleSize / 2,
    left: rect.left + handleSize / 2,
    bottom: rect.bottom - handleSize / 2,
    right: rect.right - handleSize / 2
  }
}

function handleSwipe(_event: PointerEvent) {
  const sliderEl = <HTMLElement>unrefElement(sliderRef)
  const sliderRect = getRect(sliderEl)
  const maybeContainedRect = unref(isContained) ? getContainedRect(sliderRect) : sliderRect
  const progress = calculateProgress(maybeContainedRect, posEnd, clickOffset)
  const currentValue = getValue(progress)

  if (isNumber(modelValue.value)) {
    if (isDefined(props.step) && props.step !== 'any') {
      modelValue.value = getValueAtStep(currentValue, Number(props.step))
      return
    }
    modelValue.value = currentValue
    return
  }

  if (!isArray(modelValue.value) || !currentHandle.value) {
    return
  }

  const handleIndex = handlesRef.value.indexOf(currentHandle.value)

  if (props.preventOverlap) {
    const minDistance = Number(props.minDistance || 0)

    const prevValue = modelValue.value[handleIndex - 1]
    const nextValue = modelValue.value[handleIndex + 1]

    if (prevValue && prevValue >= currentValue - minDistance) {
      modelValue.value.splice(handleIndex, 1, prevValue + minDistance)
      return
    }

    if (nextValue && nextValue <= currentValue + minDistance) {
      modelValue.value.splice(handleIndex, 1, nextValue - minDistance)
      return
    }
  }

  modelValue.value.splice(handleIndex, 1, currentValue)
}

const VARIANT_CLASSES = {
  contained: 'v-contained',
  horizontal: 'v-horizontal',
  vertical: 'v-vertical',
  rtl: 'v-rtl',
  ltr: 'v-ltr',
  btt: 'v-btt',
  labelVisibility: 'v-label-visible',
  labelHidden: 'v-label-hidden',
  glide: 'v-glide'
} as const

const STATE_CLASSES = {
  enabled: 'v-enabled',
  disabled: 'v-disabled',
  focused: 'v-focused',
  hovered: 'v-hovered',
  pressed: 'v-pressed',
  swiping: 'v-swiping'
} as const

const stateClasses = computed(() => {
  return {
    [STATE_CLASSES.swiping]: isSwiping.value,
    [STATE_CLASSES.disabled]: isDisabled.value
  }
})

const variantClasses = computed(() => {
  return {
    [VARIANT_CLASSES.contained]: isContained.value,
    [VARIANT_CLASSES.horizontal]: !isVertical.value,
    [VARIANT_CLASSES.vertical]: isVertical.value,
    [VARIANT_CLASSES.rtl]: isRtl.value,
    [VARIANT_CLASSES.ltr]: !isRtl.value,
    [VARIANT_CLASSES.btt]: isBtt.value,
    [STATE_CLASSES.enabled]: !isDisabled.value,
    [STATE_CLASSES.disabled]: isDisabled.value
  }
})

const styleBinding = computed(() => {
  const lowerValue = Math.min(...modelValueProgress.value)
  const upperValue = Math.max(...modelValueProgress.value)
  return {
    '--progress': `${modelValueProgress.value?.length > 1 ? upperValue - lowerValue : lowerValue}%`,
    '--lower-bound-value': `${lowerValue}%`
  }
})
</script>

<template>
  <div
    ref="rootRef"
    :class="[{ ...stateClasses, ...variantClasses }]"
    :dir="dir"
    :style="styleBinding"
    class="slider-root"
  >
    <div ref="sliderRef" class="slider-input">
      <slot name="before" />
      <slot name="track">
        <div :style="trackStyle" class="slider-track">
          <div class="slider-track-fill" />
        </div>
      </slot>
      <div class="slider-ticks">
        <slot name="ticks" />
      </div>
      <div
        v-for="(progress, index) in modelValueProgress"
        :key="index"
        :ref="handlesRef.set"
        :inert="isDisabled"
        :style="{ '--_offset': `${progress}%` }"
        class="slider-handle"
        role="slider"
        tabindex="0"
      >
        <slot name="handle">
          <div class="slider-handle-touch-target" />
        </slot>
        <div class="slider-label-container">
          <span class="slider-label-text">
            <slot name="labelText">
              {{ getValue(progress) }}
            </slot>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
:root {
  /* Tooltip */
  --slider-label-offset: 8px;
  --slider-label-padding-x: 16px;
  --slider-label-padding-y: 12px;
  --slider-label-border-radius: 50%;
  --slider-label-background-color: rgb(var(--inverse-surface-rgb));
  --slider-label-text-color: rgb(var(--inverse-on-surface-rgb));

  /* Handle */
  --slider-handle-shadow-size: 0px;
  --slider-handle-border-radius: 50%;
  --slider-handle-cursor: default;

  /* Track */
  --slider-track-border-radius: 16px;
  --slider-track-border-width: 0px;
  --slider-track-border: solid var(--slider-track-border-width) var(--slider-track-border-color);
  --slider-track-color: rgb(var(--surface-variant-rgb));
  --slider-track-border-color: rgb(var(--outline-variant-rgb));

  /* Track Fill */
  --slider-fill-color: rgb(var(--primary-rgb));

  /* Horizontal */
  --slider-horizontal-height: 8px;
  --slider-horizontal-width: clamp(100px, 100%, 1000px);
  --slider-horizontal-handle-width: 24px;
  --slider-horizontal-handle-height: 24px;

  /* Vertical */
  --slider-vertical-height: clamp(100px, 100%, 1000px);
  --slider-vertical-width: 8px;
  --slider-vertical-handle-width: 24px;
  --slider-vertical-handle-height: 24px;

  --slider-track-width: var(--slider-horizontal-width);
  --slider-track-height: var(--slider-horizontal-height);
}

.slider-root {
  --progress: 0%;
  --lower-bound-value: 0%;
  --upper-bound-value: 0%;

  /* Position */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  /* Size */
  inline-size: var(--slider-track-width, 180px);

  &.v-disabled {
    pointer-events: none;

    .slider-handle {
      pointer-events: all;
      cursor: default;
      background: rgb(var(--on-surface-rgb));
    }
  }

  &.v-label-visible {
    .slider-label-container {
      opacity: 1;
      pointer-events: auto;
    }
  }

  &.v-label-hidden {
    .slider-label-container {
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }
  }

  &.v-horizontal {
    --slider-track-height: var(--slider-horizontal-height);
    --slider-track-width: var(--slider-horizontal-width);
    --slider-handle-width: var(--slider-horizontal-handle-width);
    --slider-handle-height: var(--slider-horizontal-handle-height);

    min-block-size: var(--slider-handle-height);

    .slider-track-fill {
      transform: scaleX(var(--progress));
    }

    &.v-ltr {
      .slider-handle {
        inset-block-start: calc(50% - calc(var(--slider-handle-height) / 2));
        inset-inline-start: calc(var(--_offset) - calc(var(--slider-handle-width) / 2));
      }

      .slider-track-fill {
        transform-origin: left;
      }

      &:has(.slider-handle:not(:last-child)) {
        .slider-track-fill {
          inset-inline-start: var(--lower-bound-value, 0%);
        }
      }
    }

    &.v-rtl {
      .slider-handle {
        inset-block-start: calc(50% - calc(var(--slider-handle-height) / 2));
        inset-inline-start: calc(var(--_offset) - calc(var(--slider-handle-width) / 2));
      }

      .slider-track-fill {
        inset-inline-start: var(--upper-bound-value, 0%);
        transform-origin: right;
      }

      &:has(.slider-handle:not(:last-child)) {
        .slider-track-fill {
          inset-inline-start: var(--lower-bound-value, 0%);
        }
      }
    }
  }

  &.v-vertical {
    --slider-track-height: var(--slider-vertical-height);
    --slider-track-width: var(--slider-vertical-width);
    --slider-handle-width: var(--slider-vertical-handle-width);
    --slider-handle-height: var(--slider-vertical-handle-height);

    min-inline-size: var(--slider-handle-height);

    .slider-handle {
      inset-inline-start: calc(50% - calc(var(--slider-handle-width) / 2));
      inset-block-start: calc(var(--_offset) - calc(var(--slider-handle-height) / 2));
    }

    .slider-track-fill {
      transform: scaleY(var(--progress));
      transform-origin: top;
    }

    &.v-btt {
      .slider-handle {
        inset-inline-start: calc(50% - calc(var(--slider-handle-width) / 2));
        inset-block-start: calc(100% - var(--_offset) - calc(var(--slider-handle-height) / 2));
      }

      .slider-track-fill {
        transform-origin: bottom;
      }
    }

    &:has(.slider-handle:not(:last-child)) {
      .slider-track-fill {
        inset-block-start: var(--lower-bound-value, 0%);
      }

      &.v-btt {
        .slider-track-fill {
          transform-origin: top;
          inset-block-start: calc(100% - var(--upper-bound-value));
        }
      }
    }
  }

  &.v-contained {
    padding-inline: 0;

    &.v-horizontal {
      &.v-ltr {
        .slider-handle {
          transform: translateX(calc(150% - var(--_offset) - var(--slider-handle-width)));
        }
      }

      &.v-rtl {
        .slider-handle {
          transform: translateX(calc(var(--_offset) - 50%));
        }
      }
    }

    &.v-vertical {
      &:not(.v-btt) {
        .slider-handle {
          transform: translateY(calc(150% - var(--_offset) - var(--slider-handle-height)));
        }
      }

      &.v-btt {
        .slider-handle {
          transform: translateY(calc(var(--_offset) - 50%));
        }
      }
    }
  }
}

.slider-input {
  position: relative;
  inline-size: 100%;
  block-size: 100%;
}

.slider-track {
  --_height: var(--slider-track-height);
  --_width: var(--slider-track-width);
  block-size: var(--_height, var(--slider-track-height));
  inline-size: var(--_width, var(--slider-track-width));
  border: var(--slider-track-border);
  background-color: var(--slider-track-color);
  border-radius: var(--slider-track-border-radius);
  position: relative;
  overflow: clip;
  max-block-size: 100%;
  min-inline-size: 80px;

  .v-vertical & {
    min-block-size: 80px;
    min-inline-size: 100%;
    max-inline-size: 100%;
  }
}

.slider-track-fill {
  background-color: var(--slider-fill-color);
  block-size: 100%;
  inline-size: 100%;
  position: absolute;
  inset: 0;
  border: none;
}

.slider-handle-touch-target {
  position: absolute;
  max-inline-size: 48px;
  max-block-size: 48px;
  left: calc(var(--slider-handle-width) / -2);
  top: calc(var(--slider-handle-height) / -2);
  width: calc(var(--slider-handle-width) * 2);
  height: calc(var(--slider-handle-height) * 2);
  transform: translate(0%, 25%);

  .v-vertical & {
    background-color: transparent;
    transform: translateY(50%);
  }
}

.slider-handle {
  position: absolute;
  /*
    block-size: var(--slider-handle-height);
    inline-size: var(--slider-handle-width);
    */
  width: var(--slider-handle-width);
  height: var(--slider-handle-height);
  cursor: var(--slider-handle-cursor);

  &:has(.slider-handle-touch-target) {
    border-radius: var(--slider-handle-border-radius);
    cursor: pointer;
    box-shadow: 0 0 0 var(--slider-handle-shadow-size) rgb(var(--primary-rgb) / 0.2);
    background: rgb(var(--primary-rgb));
  }

  z-index: 10;

  &:focus {
    outline: none;
  }
}

.slider-label-container {
  position: absolute;
  background: var(--slider-label-background-color);
  color: var(--slider-label-text-color);
  padding: var(--slider-label-padding-y) var(--slider-label-padding-x);
  border-radius: var(--slider-label-border-radius);
  transform: translateX(-50%);
  max-inline-size: 48px;
  max-block-size: 44px;

  min-inline-size: 40px;
  min-block-size: 38px;

  opacity: 0;
  pointer-events: none;

  scale: 0;
  transition:
    opacity 0.2s ease-in-out,
    scale 0.2s ease-in-out;

  .slider-label-text {
    font-size: 0.875rem;
    line-height: 20px;
    letter-spacing: calc(0.875rem * -0.02);
    font-weight: 500;
    font-variant: tabular-nums;
    text-align: center;
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .slider-handle:hover &,
  .slider-handle:active &,
  .slider-handle:focus & {
    opacity: 1;
    pointer-events: auto;
    scale: 1;
    transition-duration: 0.1s;
  }

  .v-vertical & {
    top: 50%;
    left: calc(100% + var(--slider-label-offset));
    transform: translateX(0) translateY(-50%);
    transform-origin: top left;

    .v-btt & {
      transform-origin: left bottom;
    }
  }

  .v-horizontal & {
    bottom: calc(100% + var(--slider-label-offset));
    left: 50%;

    transform-origin: bottom left;
  }
}
</style>
