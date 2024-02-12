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
