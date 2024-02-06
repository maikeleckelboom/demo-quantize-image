<script lang="ts" setup>
defineProps<{
  keyColor?: string
}>()

const modelValue = defineModel<number>('modelValue', { type: Number, default: 0 })
</script>

<template>
  <div class="grid py-12">
    <HctColorPicker v-model="modelValue" />
  </div>
</template>
