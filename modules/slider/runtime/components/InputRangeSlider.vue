<script lang="ts" setup>
import { type SliderProps } from '~/modules/slider/types'
import { type Position, useTemplateRefsList } from '@vueuse/core'
import { animate, snap } from 'popmotion'

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

defineSlots<{
  default: void
  before: void
  after: void
  track(): void
  handle(): void
  labelText(): void
}>()

const getRect = (el: HTMLElement) => el.getBoundingClientRect()

const isSnapping = computed(
  () =>
    props.step !== 'any' &&
    ['directional', 'true', true, ''].includes(String(props.snapping))
)
const isVertical = computed(() => props.orientation === 'vertical')

const isRtl = computed(() => {
  return ['rtl', 'ltr'].includes(props.dir)
    ? props.dir === 'rtl'
    : getComputedStyle(document.documentElement).direction === 'rtl'
})

const isBtt = computed(() => {
  if (!isVertical.value) {
    return false
  }
  return ['true', true, ''].includes(String(props.btt))
})

const isContained = computed(() => {
  return ['true', true, ''].includes(String(props.contained))
})
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

function getPrecision(step: number) {
  if (!isNumber(step)) return 0
  const stepString = step.toString()
  if (stepString.indexOf('.') >= 0) {
    return stepString.length - stepString.indexOf('.') - 1
  }
  return 0
}

function getDecimals(step: number) {
  return Number(props.decimals ?? Math.max(0, getPrecision(step)))
}

function getValueAtStep(value: number, step: number) {
  return Math.round(value / step) * step
}

function roundFormat(value: number) {
  const decimals = getDecimals(Number(props.step))
  if (Number(props.step)) {
    const valueAtStep = getValueAtStep(value, Number(props.step))
    return roundNumber(valueAtStep, decimals)
  }
  return roundNumber(value, decimals)
}

function format(value: number) {
  if (props.labelFormat && typeof props.labelFormat === 'function') {
    return props.labelFormat(value)
  }
  return roundFormat(value)
}

function convertRange(min: number, max: number, a: number, b: number, x: number) {
  const temp = max - min
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

function getClosestSnapValue(value: number) {
  if (!isSnapping.value || !isArray(props.snapValues)) return value
  const decimals = getDecimals(Number(props.step))
  const valueAtStep = snap(props.snapValues)(value)
  return roundNumber(valueAtStep, decimals)
}

const { isSwiping, posEnd } = usePointerSwipe(rootRef, {
  threshold: 0,
  disableTextSelect: true,
  onSwipeStart: (event) => {
    event.preventDefault()
    currentPointer.value = getClosestPointer(event)
    setClickOffset(event)
    if (!isSnapping.value) {
      handleSwipe(event)
    }
  },
  onSwipe: handleSwipe,
  onSwipeEnd: (event, direction) => {
    const removePointer = () => (currentPointer.value = null)
    if (isSnapping.value && isNumber(modelValue.value)) {
      animate({
        from: modelValue.value,
        to: getClosestSnapValue(modelValue.value),
        duration: 100,
        onUpdate: (v) => (modelValue.value = v),
        onComplete: () => removePointer()
      })
      return
    }
    removePointer()
  }
})

function getClosestPointer(event: PointerEvent): HTMLElement {
  const progress = getProgressFromEvent(event)
  const removeNaN = (v: number) => !isNaN(v)
  const getDistance = (v: number) => Math.abs(v - progress)
  const distances = unref(valueProgressProxy).filter(removeNaN).map(getDistance)
  const minDistance = Math.min(...distances)
  const index = distances.indexOf(minDistance)
  return pointersRef.value[index]
}

function getClickedPointer(evt: PointerEvent) {
  return pointersRef.value.find((pointerRef) => pointerRef.contains(<Node>evt.target))
}

function getDistanceToCenter(rect: DOMRect, { x, y }: Position) {
  const center = isVertical.value
    ? rect.top + rect.height / 2
    : rect.left + rect.width / 2
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
  const maybeContainedRect = unref(isContained)
    ? getContainedRect(sliderRect)
    : sliderRect
  const progress = calculateProgress(maybeContainedRect, posEnd, clickOffset)
  const pointerValue = getValue(progress)

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
    const pointerPrev = modelValue.value[pointerIndex - 1]
    const pointerNext = modelValue.value[pointerIndex + 1]
    if (shouldAdjustPointer(pointerPrev, pointerValue, minDistance)) {
      modelValue.value.splice(pointerIndex, 1, pointerPrev + minDistance)
      return
    }
    if (shouldAdjustPointer(pointerNext, pointerValue, minDistance)) {
      modelValue.value.splice(pointerIndex, 1, pointerNext - minDistance)
      return
    }
  }

  modelValue.value.splice(pointerIndex, 1, pointerValue)
}

function shouldAdjustPointer(
  pointer: number | undefined,
  pointerValue: number,
  minDistance: number
): boolean {
  return (
    pointer !== undefined &&
    pointer >= pointerValue - minDistance &&
    pointer <= pointerValue + minDistance
  )
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

const classes = computed(() => {
  return []
})

const styleBinding = computed(() => {
  const lowerValue = Math.min(...valueProgressProxy.value)
  const upperValue = Math.max(...valueProgressProxy.value)
  return {
    '--progress': `${valueProgressProxy.value?.length > 1 ? upperValue - lowerValue : lowerValue}%`
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
    <div ref="sliderRef" class="slider-wrapper">
      <slot name="default" />
      <slot name="track">
        <div :style="trackStyle" class="slider-track">
          <div class="slider-track-fill" />
        </div>
      </slot>
      <div
        v-for="(pointerValue, index) in valueProgressProxy"
        :key="index"
        :ref="pointersRef.set"
        :style="{ '--_offset': `${pointerValue}%` }"
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
              {{ format(getValue(pointerValue)) }}
            </slot>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
