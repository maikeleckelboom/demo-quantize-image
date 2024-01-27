<script lang="ts" setup>
import type { SliderProps } from '~/modules/slider/types'
import { type Position, useTemplateRefsList } from '@vueuse/core'
import type { Ref } from 'vue'
import SliderOuter from '~/modules/slider/runtime/components/SliderWrapper.vue'

const props = defineProps<SliderProps>()

const isVertical = computed(() => props.orientation === 'vertical')
const isRtl = computed(() => getOption('dir', 'ltr'))
const isBtt = computed(() => getOption('btt', false))
const isContained = computed(() => getOptionAsBool('contained', true))

const rootRef = ref<HTMLElement>()
const sliderRef = ref<HTMLElement>()
const handlesRef = useTemplateRefsList<HTMLElement>()

type ModelValue = number | number[]
const modelValue = defineModel<ModelValue>() as Ref<ModelValue>

const modelValueArray = useToArray(modelValue, 0)

const handleValues = computed((): number[] => {
  return unref(modelValueArray).map(getProgress)
})

const currentHandle = ref<HTMLElement | null>(null)
watch(currentHandle, (pointer) => pointer?.focus())

const { min, max, step } = useSteps(props)

const convertRange = (min: number, max: number, a: number, b: number, x: number) => {
  const temp = (max - min)
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
  const value = convertRange(0, 100, unref(min), unref(max), progress)
  return clamp(value, unref(min), unref(max))
}

function getProgress(value: number) {
  const range = convertRange(unref(min), unref(min), 0, 100, value)
  return clamp(range, 0, 100)
}

function getToReversed() {
  const isHorizontalAndRtl = !unref(isVertical) && isRtl.value
  const isVerticalAndBtt = unref(isVertical) && isBtt.value
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

function getProgressFromEvent(event: PointerEvent) {
  const sliderEl = unrefElement(sliderRef)
  const sliderRect = getRect(<HTMLElement>sliderEl)
  return calculateProgress(sliderRect, {
    x: event.clientX,
    y: event.clientY
  })
}

function getClosestPointer(event: PointerEvent): HTMLElement {
  const progress = getProgressFromEvent(event)
  const getDistance = (percentage: number) => Math.abs(percentage - progress)
  const distances = unref(handleValues).map((value) => getDistance(getProgress(value)))
  const minDistance = Math.min(...distances)
  const index = distances.indexOf(minDistance)
  return handlesRef.value[index]
}

function getClickedPointer(evt: PointerEvent) {
  return handlesRef.value.find((handleRef) => evt?.target && handleRef.contains(<Node>evt.target))
}

function getDistanceToCenter(rect: DOMRect, { x, y }: Position) {
  const center = unref(isVertical) ? rect.top + rect.height / 2 : rect.left + rect.width / 2
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
    currentHandle.value = getClosestPointer(event)
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

function getOptionAsBool<T extends keyof SliderProps>(option: T, defaultValue?: boolean) {
  const isTrue = (v: unknown) => [true, 'true', 'always'].includes(v as T)
  const isFalse = (v: unknown) => [false, 'false', 'never'].includes(v as T)
  return isTrue(props[option]) ? true : isFalse(props[option]) ? false : defaultValue
}

function getOption<T extends keyof SliderProps, D = SliderProps[T]>(option: T, defaultValue?: D): D {
  return (props[option] ?? defaultValue) as D
}

function getSwipeProgress(sliderRect: DOMRect) {
  const maybeContainedRect = unref(isContained) ? getContainedRect(sliderRect) : sliderRect
  return calculateProgress(maybeContainedRect, posEnd, clickOffset)
}

function handleSwipe(event: PointerEvent) {
  const currentHandleEl = unrefElement(currentHandle)
  const sliderEl = unrefElement(sliderRef)
  if (!currentHandleEl || !sliderEl) return

  const sliderRect = getRect(sliderEl)
  const progress = getSwipeProgress(sliderRect)
  const updatedValue = getValue(progress)

  if (isNumber(modelValue.value)) {
    modelValue.value = updatedValue
    return
  }

  const pointerIndex = handlesRef.value.indexOf(currentHandleEl)

  if (getOptionAsBool('preventOverlap')) {
    const minDistance = getOption('minDistance', 0)
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
</script>

<template>
  <div ref="rootRef" class="slider-root">
    <SliderWrapper>
      <Slider ref="sliderRef">
        <slot name="track">
          <SliderTrack>
            <slot name="trackFill">
              <SliderTrackFill />
            </slot>
          </SliderTrack>
        </slot>
        <template v-for="(value, idx) in handleValues" :key="idx">
          <slot :index="idx" :value="value" name="handle">
            <SliderHandle :ref="handlesRef.set">
              {{ value }}
            </SliderHandle>
          </slot>
        </template>
        <SliderHandle />
      </Slider>
    </SliderWrapper>
  </div>
</template>

<style scoped>

</style>
