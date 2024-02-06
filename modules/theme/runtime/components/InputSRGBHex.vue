<script lang="ts" setup>
const modelValue = defineModel<string>()
</script>

<template>
  <div class="flex flex-col items-center">
    <input
      v-model="modelValue"
      class="peer absolute bottom-0 left-0 top-0 rounded-md border-none opacity-0"
      type="color"
    />
    <div
      :style="{ backgroundColor: modelValue }"
      class="duration-125 pointer-events-none absolute bottom-0 left-0 top-0 h-[34px] w-[34px] rounded-md"
    />
  </div>
</template>

<style>
input[type='color'] {
  --_s: 34px;
  --_r: 8px;
  position: absolute;
  width: var(--_s);
  height: var(--_s);

  &::-webkit-color-swatch-wrapper {
    border-radius: var(--_r);
    border: none;
    padding: 0;
  }
}
</style>
