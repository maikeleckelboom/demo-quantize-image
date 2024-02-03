<script lang="ts" setup>
const modelValue = defineModel<string>()
</script>

<template>
  <div class="flex flex-col items-center">
    <input
      v-model="modelValue"
      class="absolute bottom-0 left-0 top-0 rounded-md border-none opacity-0"
      type="color"
    />
    <div
      :style="{ backgroundColor: modelValue }"
      class="pointer-events-none absolute bottom-0 left-[4px] top-[4px] h-[30px] w-[30px] rounded-md"
    />
  </div>
</template>

<style lang="postcss">
input[type='color'] {
  --_s: 30px;
  --_r: 5px;
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
