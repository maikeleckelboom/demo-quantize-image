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
  const pointerValue = roundDecimals(getValue(progress), Number(props.decimals ?? 2))

  if (isNumber(modelValue.value)) {
    modelValue.value = pointerValue
    return
  }

  if (!isArray(modelValue.value) || !currentPointer.value) {
    return
  }

  const pointerIndex = pointersRef.value.indexOf(currentPointer.value)

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
  if (isArray(props.marks)) return props.marks.map((mark) => {
    return {
      value: Number(mark),
      active: isMarkActive({ value: Number(mark), active: false })
    }
  })
  if (typeof props.marks === 'object') return Object.keys(props.marks).map((key) => ({
    value: Number(key),
    active: isMarkActive({ value: Number(key), active: false })
  }))
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
</script>

<template>
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
</template>

<style lang="postcss">

</style>
