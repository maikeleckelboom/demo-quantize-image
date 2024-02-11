<script generic="T extends Marks" lang="ts" setup>
import { isMarkArray, isMarkObjectArray, type Marks } from '~/modules/slider/types'

interface Props {
  ticks: T
  vertical?: boolean
  reverse?: boolean
}

const props = defineProps<Props>()

const ticks = computed(() => {
  const { marks, vertical, reverse } = props

  if (isMarkArray(marks)) {
    return marks
  }

  if (isMarkObjectArray(marks)) {
    return marks.map((mark) => mark.value)
  }

  return []
})

watchEffect(() => {
  nextTick(() => {
    console.log(marks.value)
  })
})
</script>

<template>
  <div class="slider-marks">
    <div v-for="(mark, idx) in marks" :key="idx" class="slider-mark">
      <span class="slider-mark-text">{{ mark }}</span>
    </div>
  </div>
</template>

<style scoped>
.slider-marks-old {
  position: absolute;
  inset-inline: 0;
  inset-block-start: 0;
  transform: translateY(50%);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-block: 4px;
  min-inline-size: 100%;
  pointer-events: none;
}

.slider-mark-old {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  inset-inline: 0;
  inset-block-start: 0;

  &:first-child {
    inset-inline-start: 0;
  }

  &:last-child {
    inset-inline-end: 0;
  }

  .slider-mark-text {
    position: absolute;
    inset-inline: 0;
    inset-block-start: 0;
    transform: translateY(50%) translateX(-50%);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 0.75rem;
    font-weight: 500;
  }
}
</style>
