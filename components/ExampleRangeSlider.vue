<script lang="ts" setup>
import type { SliderProps } from '~/modules/slider/types'
import { type Position, useTemplateRefsList } from '@vueuse/core'

const getRect = (el: HTMLElement) => el.getBoundingClientRect()

const isNumber = (value: unknown): value is number => typeof value === 'number'

const useSteps = (props: SliderProps) => {
  const min = computed(() => Number(props.min))
  const max = computed(() => Number(props.max))
  const step = computed(() => Number(props.step))
  return { min, max, step }
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)


const props = withDefaults(defineProps<SliderProps>(), {
  min: 0,
  max: 100,
  step: 'any',
  dir: 'ltr',
  btt: false,
  orientation: 'horizontal',
  contained: true,
  disabled: false,
  preventOverlap: true,
  minDistance: 0,
  labelVisibility: 'auto'
})

function getOption<T extends keyof SliderProps, D = SliderProps[T]>(option: T, defaultValue?: D): D {
  return (props[option] ?? defaultValue) as D
}

const isVertical = computed(() => props.orientation === 'vertical')
const isRtl = computed(() => props.dir === 'rtl')
const isBtt = computed(() => props.btt)
const isContained = computed(() => getOption('contained', true))
const isDisabled = computed(() => props.disabled)

const modelValue = defineModel<number | number[]>()

const valueProgressProxy = computed(() => {
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
const pointersRef = useTemplateRefsList<HTMLElement>()


const currentPointer = ref<HTMLElement | null>(null)
watch(currentPointer, (pointer) => pointer?.focus())

let clickOffset: Position = { x: 0, y: 0 }

function setClickOffset(evt: PointerEvent) {
  clickOffset = { x: 0, y: 0 }
  const clickedPointer = getClickedPointer(evt)
  if (clickedPointer) {
    const pointerRect = getRect(clickedPointer)
    const distanceFromPointerCenter = getDistanceToCenter(pointerRect, posEnd)
    clickOffset = {
      x: isVertical.value ? 0 : distanceFromPointerCenter,
      y: isVertical.value ? distanceFromPointerCenter : 0
    }
  }
}

function roundDecimals(value: number, decimals: number) {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals)
}

function roundFormat(value: number) {
  const decimals = Number(props.step) % 1 ? String(props.step).split('.')[1].length : 0
  if (Number(props.step)) {
    const valueAtStep = Math.round(value / Number(props.step)) * Number(props.step)
    return roundDecimals(valueAtStep, decimals)
  }
  return roundDecimals(value, decimals)
}

function format(value: number) {
  if (props.labelFormat && typeof props.labelFormat === 'function') {
    return props.labelFormat(roundFormat(value), value)
  }
  return roundFormat(value)
}

function convertRange(min: number, max: number, a: number, b: number, x: number) {
  const temp = (max - min)
  if (temp === 0) return a
  return ((b - a) * (x - min)) / temp + a
}

function getValue(progress: number) {
  const min = Number(props.min)
  const max = Number(props.max)
  const value = convertRange(0, 100, min, max, progress)
  return clamp(value, min, max)
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

/*
function animateModelValue(to: number, duration = 300) {
  animate({
    from: modelValue.value,
    to,
    duration,
    ease: (v) => cubicBezier(...TransitionPresets.easeInOutCubic)(v),
    onUpdate: (v) => modelValue.value = v
  })
}
*/

const { isSwiping, posEnd } = usePointerSwipe(rootRef, {
  threshold: 0,
  disableTextSelect: true,
  onSwipeStart: (event) => {
    event.preventDefault()
    currentPointer.value = getClosestPointer(event)
    setClickOffset(event)
    handleSwipe(event)
  },
  onSwipe: handleSwipe,
  onSwipeEnd: (event, direction) => {
    handleSwipe(event)
    currentPointer.value = null
  }
})

function getClosestPointer(event: PointerEvent): HTMLElement {
  const progress = getProgressFromEvent(event)
  const removeNaN = (v: number) => !isNaN(v)
  const getDistance = (percentage: number) => Math.abs(percentage - progress)
  const distances = unref(valueProgressProxy).filter(removeNaN).map(getDistance)
  const minDistance = Math.min(...distances)
  const index = distances.indexOf(minDistance)
  return pointersRef.value[index]
}

function getClickedPointer(evt: PointerEvent) {
  return pointersRef.value.find((pointerRef) => pointerRef.contains(<Node>evt.target))
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

function calculateProgress(parentRect: DOMRect, endPos: Position, offsetPos: Position = { x: 0, y: 0 }) {
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

const handleWidthVar = useCssVar('--slider-handle-width', rootRef)
const handleHeightVar = useCssVar('--slider-handle-height', rootRef)

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

  if (isNumber(modelValue.value)) {
    modelValue.value = getValue(progress)
    return
  }

  if (!isArray(modelValue.value) || !currentPointer.value) {
    return
  }

  const pointerIndex = pointersRef.value.indexOf(currentPointer.value)
  const pointerValue = getValue(progress)

  if (props.preventOverlap) {
    const minDistance = Number(props.minDistance)

    const pointerBefore = modelValue.value[pointerIndex - 1]
    const pointerAfter = modelValue.value[pointerIndex + 1]

    if (pointerBefore && pointerBefore >= pointerValue - minDistance) {
      modelValue.value.splice(pointerIndex, 1, pointerBefore + minDistance)
      return
    }

    if (pointerAfter && pointerAfter <= pointerValue + minDistance) {
      modelValue.value.splice(pointerIndex, 1, pointerAfter - minDistance)
      return
    }
  }
  modelValue.value.splice(pointerIndex, 1, pointerValue)
}

function getMarksEnabled() {
  const isDefined = !!props?.marks
  const isArr = isDefined && isArray(props.marks)
  const isObj = isDefined && !isArr && typeof props.marks === 'object'
  const hasLength = isArr || isObj && Object.keys(props.marks).length > 0
  return isDefined && hasLength
}

function isMarkActive(mark: { value: number, active: boolean }) {
  const value = getValue(mark.value)
  if (isArray(modelValue.value)) {
    return modelValue.value.includes(value)
  }
  if (isNumber(modelValue.value)) {
    return value <= modelValue.value
  }
  return false
}

const marksArray = computed(() => {
  if (!getMarksEnabled()) return []
  return [
    { value: 0, active: isMarkActive({ value: 0, active: false }) },
    { value: 100, active: isMarkActive({ value: 100, active: false }) }
  ]
})

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
  enabled: 'v-is-enabled',
  disabled: 'v-is-disabled',
  focused: 'v-is-focused',
  hovered: 'v-is-hovered',
  pressed: 'v-is-pressed',
  swiping: 'v-is-swiping'
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
  const lowerValue = Math.min(...valueProgressProxy.value)
  const upperValue = Math.max(...valueProgressProxy.value)
  if (valueProgressProxy.value.length > 1) {
    return {
      '--progress': `${upperValue - lowerValue}%`,
      '--lower-bound-value': `${lowerValue}%`,
      '--upper-bound-value': `${upperValue}%`
    }
  }
  return {
    '--progress': `${lowerValue}%`
  }
})

const slots = defineSlots<{
  default: void
  before: void
  after: void
  track(): void
  handle(): void
  labelText(): void
}>()


const getHandleSlot = (index: number = 0) => {
  const handleSlot = slots.handle
  if (typeof handleSlot === 'function') {
    return slots.handle?.()?.[index] ?? slots.handle?.()
  }
  return null
}
const getLabelSlot = (index: number = 0) => {
  const labelSlot = slots.labelText
  if (typeof labelSlot === 'function') {
    return slots.labelText?.()?.[index] ?? slots.labelText?.()
  }
  return null
}
const hasHandleSlot = computed(() => !!getHandleSlot())
const hasLabelSlot = computed(() => !!getLabelSlot())

</script>

<template>
  <SliderFrame>
    <template #before>
      <slot name="before" />
    </template>
    <div ref="rootRef"
         :class="{...stateClasses,...variantClasses}"
         :dir="dir"
         :style="styleBinding"
         class="slider-root">
      <div ref="sliderRef" class="slider-input">
        <slot name="default" />
        <slot name="track">
          <div :style="trackStyle" class="slider-track">
            <div class="slider-track-fill" />
          </div>
        </slot>
        <div v-for="mark in marksArray"
             :key="mark.value"
             :class="{active: mark.active}"
             :style="{'--_offset': `${mark.value}%`}"
             class="slider-stop-mark"
        />
        <div v-for="(pointerValue, index) in valueProgressProxy"
             :key="index"
             :ref="pointersRef.set"
             :aria-valuemax="max"
             :aria-valuemin="min"
             :aria-valuenow="getValue(pointerValue)"
             :data-index="index"
             :style="{'--_offset': `${pointerValue}%`}"
             class="slider-handle"
             role="slider"
             tabindex="0">
          <slot name="handle">
            <div class="slider-handle-touch-target" />
          </slot>
          <div class="slider-handle-label-container">
          <span class="slider-label-text">
            <slot name="labelText">
              {{ format(getValue(pointerValue)) }}
            </slot>
          </span>
          </div>
        </div>
      </div>
    </div>
    <template #after>
      <slot name="after" />
    </template>
  </SliderFrame>
</template>

<style lang="postcss">
:root {
  /* Tooltip */
  --slider-tooltip-offset: 8px;
  --slider-tooltip-padding-x: 16px;
  --slider-tooltip-padding-y: 12px;
  --slider-tooltip-border-radius: 50%;
  --slider-tooltip-background-color: rgb(var(--inverse-surface-rgb));
  --slider-tooltip-text-color: rgb(var(--inverse-on-surface-rgb));

  /* Handle */
  --slider-handle-shadow-size: 0px;
  --slider-handle-border-radius: 50%;

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
  --slider-horizontal-width: 260px;
  --slider-horizontal-handle-width: 24px;
  --slider-horizontal-handle-height: 24px;

  /* Vertical */
  --slider-vertical-height: 260px;
  --slider-vertical-width: 8px;
  --slider-vertical-handle-width: 24px;
  --slider-vertical-handle-height: 24px;
}

.slider-stop-mark {
  --stop-indicator-width: 4px;
  --stop-indicator-height: 4px;
  --stop-indicator-border-radius: 50%;
  --_offset: 0%;
  position: absolute;
  inline-size: var(--stop-indicator-width);
  block-size: var(--stop-indicator-height);
  border-radius: var(--stop-indicator-border-radius);

  background: rgb(var(--primary-rgb));

  &.active {
    background: rgb(var(--primary-container-rgb));
  }

  .v-btt & {
    background: rgb(var(--primary-container-rgb));

    &.active {
      background: rgb(var(--primary-rgb));
    }
  }

  .v-vertical & {
    inset-block-start: calc(var(--_offset) - calc(var(--stop-indicator-height) * 0.5));
    inset-inline-start: 50%;
    transform: translateX(-50%) translateY(calc(var(--slider-handle-height) * 0.5));

    &:last-child {
      transform: translateX(-50%) translateY(calc(var(--slider-handle-height) * -0.5));
    }
  }

  .v-horizontal & {
    inset-block-start: 50%;
    inset-inline-start: calc(var(--_offset) - calc(var(--stop-indicator-width) * 0.5));
    transform: translateX(calc(var(--slider-handle-width) * 0.5)) translateY(-50%);

    &:last-child {
      transform: translateX(calc(var(--slider-handle-width) * -0.5)) translateY(-50%);
    }
  }
}

.slider-root {
  --progress: 0%;
  --lower-bound-value: 0%;
  --upper-bound-value: 0%;

  position: relative;
  min-inline-size: var(--slider-track-width);
  min-block-size: var(--slider-track-height);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  &.v-label-visible {
    .slider-handle-label-container {
      opacity: 1;
      pointer-events: auto;
    }
  }

  &.v-label-hidden {
    .slider-handle-label-container {
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

    inline-size: 100%;

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
    block-size: 100%;

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
  min-block-size: var(--_height, var(--slider-track-height));
  min-inline-size: var(--_width, var(--slider-track-width));
  border: var(--slider-track-border);
  background-color: var(--slider-track-color);
  border-radius: var(--slider-track-border-radius);
  position: relative;
  overflow: clip;
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

  .v-vertical & {
    background-color: transparent;
    transform: translateY(50%);
  }
}

.slider-handle {
  position: absolute;

  block-size: var(--slider-handle-height);
  inline-size: var(--slider-handle-width);


  &:not(:has(.slider-handle-touch-target)) {
    /* Slot used */

  }

  &:has(.slider-handle-touch-target) {
    /* Slot not used */
    border-radius: var(--slider-handle-border-radius);
    cursor: pointer;
    box-shadow: 0 0 0 var(--slider-handle-shadow-size) rgb(var(--primary-rgb) / 0.2);
    background: rgb(var(--primary-rgb));
  }

  /*

    */
  z-index: 10;

  &:focus {
    outline: none;
  }

  /*
    &:active {
      --slider-handle-shadow-size: 12px;
    }


    &:focus:not(:active) {
      --slider-handle-shadow-size: 8px;
    }*/

}

.slider-handle-label-container {
  position: absolute;
  background: var(--slider-tooltip-background-color);
  color: var(--slider-tooltip-text-color);
  padding: var(--slider-tooltip-padding-y) var(--slider-tooltip-padding-x);
  border-radius: var(--slider-tooltip-border-radius);
  transform: translateX(-50%);
  max-inline-size: 48px;
  max-block-size: 44px;

  min-inline-size: 40px;
  min-block-size: 38px;

  opacity: 0;
  pointer-events: none;

  scale: 0;
  transition: opacity 0.2s ease-in-out, scale 0.2s ease-in-out;

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
    left: calc(100% + var(--slider-tooltip-offset));
    transform: translateX(0) translateY(-50%);
    transform-origin: top left;

    .v-btt & {
      transform-origin: left bottom;
    }
  }

  .v-horizontal & {
    bottom: calc(100% + var(--slider-tooltip-offset));
    left: 50%;

    transform-origin: bottom left;
  }
}
</style>
