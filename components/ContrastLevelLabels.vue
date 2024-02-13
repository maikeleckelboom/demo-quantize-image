<script lang="ts" setup>
import { twMerge } from 'tailwind-merge'

type Mark = {
  value: number
  label: string
  offset?: number
}

const marks: Mark[] = [
  { value: -1, label: 'Reduced' },
  { value: 0, label: 'Low' },
  { value: 0.5, label: 'Medium' },
  { value: 1, label: 'High' }
]

function calculateOffset(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100
}

function getOffset(mark: Mark) {
  return calculateOffset(mark.value, -1, 1)
}

const computedMarks = computed(() =>
  marks.map((mark) => {
    mark.offset = getOffset(mark)
    return mark
  })
)
</script>

<template>
  <div class="relative col-span-full flex h-[38px] items-start justify-start">
    <div
      v-for="(mark, idx) in computedMarks"
      :key="mark.value"
      :class="
        twMerge([
          'absolute flex flex-col items-center justify-center',
          'hover:opacity-80 active:opacity-90',
          '-translate-x-1/2'
        ])
      "
      :style="{ left: `${mark.offset}%` }"
      class="mark"
      @click="onMarkClick(mark)"
    >
      <span class="h-2 w-1 rounded-lg bg-outline" />
      <span
        :class="{
          'ml-[50%]': idx === 0,
          'mr-[50%]': idx === computedMarks.length - 1
        }"
        class="mt-2.5 flex flex-col items-center justify-center gap-1.5 text-label-sm font-medium leading-none text-outline"
      >
        <span>{{ mark.label }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped></style>
