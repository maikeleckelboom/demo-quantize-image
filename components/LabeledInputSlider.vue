<script lang="ts" setup>
const modelValue = defineModel<number>('modelValue', { type: Number, default: 0 })
</script>

<template>
  <div>
    {{ modelValue }}
    <InputRangeSlider v-model="modelValue" v-bind="$attrs"></InputRangeSlider>
  </div>
</template>

<style scoped></style>
