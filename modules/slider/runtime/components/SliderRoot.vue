<script lang="ts" setup>
import type { SliderProps } from '~/modules/slider/types'
import { type Position, useTemplateRefsList } from '@vueuse/core'
import type { Ref } from 'vue'
import type { SliderHandle } from '#components'
import { isArray } from '@vue/shared'

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

const isVertical = computed(() => props.orientation === 'vertical')
const isRtl = computed(() => props.dir === 'rtl')

const rootRef = ref<HTMLElement>()
const sliderRef = ref<HTMLElement>()

const handlesRef = useTemplateRefsList<InstanceType<typeof SliderHandle>>()

type ModelValue = number | number[]
const modelValue = defineModel<ModelValue>() as Ref<ModelValue>

const modelValueProxy = computed({
  get: () => {
    return isArray(modelValue.value) ? modelValue.value : [modelValue.value]
  },
  set: (value) => {
    modelValue.value = isArray(value) ? value.map(getValue) : [getValue(value)]
  }
})

const currentHandle = ref<HTMLElement | null>(null)

watch(currentHandle, (pointer) => pointer?.focus())

const convertRange = (min: number, max: number, a: number, b: number, x: number) => {
  const temp = max - min
  if (temp === 0) return a
  return ((b - a) * (x - min)) / temp + a
}

function getRect(el: HTMLElement) {
  return el.getBoundingClientRect()
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getValue(progress: number) {
  const value = convertRange(0, 100, Number(props.min), Number(props.max), progress)
  return clamp(value, Number(props.min), Number(props.max))
}

function getProgress(value: number) {
  const range = convertRange(Number(props.min), Number(props.min), 0, 100, value)
  return clamp(range, 0, 100)
}

function getToReversed() {
  const isHorizontalAndRtl = !unref(isVertical) && isRtl.value
  const isVerticalAndBtt = unref(isVertical) && props.btt
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

function getProgressFromEvent(event: PointerEvent) {
  const sliderElement = unrefElement(sliderRef)
  const sliderRect = getRect(<HTMLElement>sliderElement)
  return calculateProgress(sliderRect, {
    x: event.clientX,
    y: event.clientY
  })
}

function getClosestHandle(event: PointerEvent): HTMLElement {
  const progress = getProgressFromEvent(event)
  const getDistance = (percentage: number) => Math.abs(percentage - progress)
  const distances = unref(modelValueProxy).map((value) => getDistance(getProgress(value)))
  const minDistance = Math.min(...distances)
  const index = distances.indexOf(minDistance)
  return unrefElement(handlesRef.value[index]) as HTMLElement
}

function getClickedPointer(evt: PointerEvent) {
  if (!evt?.target || !handlesRef.value?.length) return
  return handlesRef.value.map((h) => h.$el).find((h) => h.contains(evt.target))
}

function getDistanceToCenter(rect: DOMRect, { x, y }: Position) {
  const center = unref(isVertical)
    ? rect.top + rect.height / 2
    : rect.left + rect.width / 2
  return unref(isVertical) ? y - center : x - center
}

const clickOffset = shallowReactive<Position>({ x: 0, y: 0 })

function setClickOffset(evt: PointerEvent) {
  Object.assign(clickOffset, { x: 0, y: 0 })
  const clickedPointer = getClickedPointer(evt)
  if (clickedPointer) {
    const pointerRect = getRect(clickedPointer)
    const distanceFromPointerCenter = getDistanceToCenter(pointerRect, posEnd)
    Object.assign(clickOffset, {
      x: isVertical.value ? 0 : distanceFromPointerCenter,
      y: isVertical.value ? distanceFromPointerCenter : 0
    })
  }
}

const { isSwiping, posEnd } = usePointerSwipe(rootRef, {
  threshold: 0,
  disableTextSelect: true,
  onSwipeStart: (event) => {
    event.preventDefault()
    currentHandle.value = getClosestHandle(event)
    setClickOffset(event)
    handleSwipe(event)
  },
  onSwipe: handleSwipe,
  onSwipeEnd: (event) => {
    handleSwipe(event)
    currentHandle.value = null
  }
})

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

const contained = computed(() => isTruthy(props.contained))
const btt = computed(() => isTruthy(props.btt))
const disabled = computed(() => isTruthy(props.disabled))

function getSwipeProgress(sliderRect: DOMRect) {
  const maybeContainedRect = contained.value ? getContainedRect(sliderRect) : sliderRect
  return calculateProgress(maybeContainedRect, posEnd, clickOffset)
}

function handleSwipe(event: PointerEvent) {
  const sliderElement = unrefElement(sliderRef)
  if (!unref(currentHandle) || !sliderElement) return

  const sliderRect = getRect(sliderElement)
  const progress = getSwipeProgress(sliderRect)
  const updatedValue = getValue(progress)

  if (isNumber(modelValue.value)) {
    modelValue.value = updatedValue
    return
  }

  const pointerIndex = handlesRef.value.findIndex((h) => h.$el === unref(currentHandle))

  if (props.preventOverlap) {
    const minDistance = Number(props.minDistance || 0)
    const pointerBefore = modelValue.value[pointerIndex - 1]
    const pointerAfter = modelValue.value[pointerIndex + 1]
    if (pointerBefore && pointerBefore >= updatedValue - minDistance) {
      modelValue.value.splice(pointerIndex, 1, pointerBefore + minDistance)
    } else if (pointerAfter && pointerAfter <= updatedValue + minDistance) {
      modelValue.value.splice(pointerIndex, 1, pointerAfter - minDistance)
    }
    return
  }

  modelValue.value.splice(pointerIndex, 1, updatedValue)
}

const rootStyleBinding = computed(() => {
  const values = unref(modelValueProxy)
  const lowerValue = Math.min(...values)
  const upperValue = Math.max(...values)
  return {
    '--progress': `${values.length > 1 ? upperValue - lowerValue : lowerValue}%`
  }
})

const classBindings = computed(() => ({
  'v-vertical': unref(isVertical),
  'v-horizontal': !unref(isVertical),
  'v-ltr': !unref(isRtl),
  'v-rtl': unref(isRtl),
  'v-btt': unref(btt),
  'v-disabled': disabled,
  'v-contained': contained
}))

function getHandleValue(handle: HTMLElement) {
  const index = handlesRef.value.findIndex((h) => h.$el === handle)
  return unref(modelValueProxy)[index]
}

function getHandleIndex(handle: HTMLElement) {
  return handlesRef.value.findIndex((h) => h.$el === handle)
}
</script>

<template>
  <div ref="rootRef" :class="classBindings" :style="rootStyleBinding" class="slider-root">
    <div ref="sliderRef" class="slider-input">
      <slot name="track">
        <SliderTrack>
          <slot name="trackFill">
            <SliderTrackFill />
          </slot>
        </SliderTrack>
      </slot>
      <template v-for="(value, index) in modelValueProxy" :key="index">
        <slot :index="index" :value="value" name="handle">
          <SliderHandle :ref="handlesRef.set" :style="{ '--_offset': `${value}%` }">
            <slot name="handle" />
            <SliderLabelContainer>
              <slot name="handleLabel">
                {{ Math.round(value) }}
              </slot>
            </SliderLabelContainer>
          </SliderHandle>
        </slot>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
