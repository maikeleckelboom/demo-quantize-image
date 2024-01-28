<script lang="ts" setup>
defineSlots<{
  default: void
  before: void
  after: void
}>()

const modelValue = defineModel<number | number[]>()
</script>

<template>
  <SliderWrapper>
    <template #before>
      <slot name="before" />
    </template>
    <slot>
      <SliderRoot v-model="modelValue">
        <slot />
      </SliderRoot>
    </slot>
    <template #after>
      <slot name="after" />
    </template>
  </SliderWrapper>
</template>

<style scoped>

</style>
