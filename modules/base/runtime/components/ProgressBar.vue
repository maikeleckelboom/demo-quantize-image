<script lang="ts" setup>
const modelValue = defineModel<number>('modelValue')
</script>

<template>
  <div class="relative h-2 w-full overflow-clip rounded-full bg-surface-variant">
    <div
      :style="{ transform: `scaleX(${modelValue}%)` }"
      class="absolute inset-0 size-full origin-left bg-primary transition-all"
    />
  </div>
</template>

<style scoped></style>
