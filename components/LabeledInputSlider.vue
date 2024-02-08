<script lang="ts" setup>
import type { SliderProps } from '~/modules/slider/types'

const modelValue = defineModel<number>('modelValue', { type: Number, default: 0 })

const props = defineProps<SliderProps>()
</script>

<template>
  <div>
    <InputRangeSlider v-model="modelValue" v-bind="$props" />
  </div>
</template>

<style scoped></style>
