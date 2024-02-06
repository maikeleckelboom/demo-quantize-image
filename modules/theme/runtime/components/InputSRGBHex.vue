<script lang="ts" setup>
const modelValue = defineModel<string>()
</script>

<template>
  <div class="v-input-srgb-hex flex flex-col items-center">
    <input
      v-model="modelValue"
      class="peer absolute bottom-0 left-[2px] top-[2px] border-none opacity-0"
      type="color"
    />
    <div
      :style="{ backgroundColor: modelValue }"
      class="duration-125 v-input-color-swatch pointer-events-none absolute bottom-[2px] left-[2px] top-[2px] h-[34px] w-[34px]"
    />
  </div>
</template>

<style>
.v-input-srgb-hex {
  --_radius: 4px;
  --_size: 38px;

  .v-input-color-swatch {
    border-radius: var(--_radius);
  }

  input[type='color'] {
    position: absolute;
    width: var(--_size);
    height: var(--_size);

    &::-webkit-color-swatch-wrapper {
      border-radius: var(--_radius);
      border: none;
      padding: 0;
    }
  }
}
</style>
