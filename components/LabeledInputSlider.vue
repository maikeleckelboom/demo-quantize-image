<script lang="ts" setup>
withDefaults(
  defineProps<{
    max?: number
    min?: number
    step?: number
  }>(),
  {
    max: 100,
    min: 0,
    step: 1
  }
)

const modelValue = defineModel<number>('modelValue', { type: Number, default: 0 })
</script>

<template>
  <div>
    {{ modelValue }}
    <InputRangeSlider v-model="modelValue" :max="max" :min="min" :step="step" v-bind="$attrs">
    </InputRangeSlider>
  </div>
</template>

<style scoped></style>
