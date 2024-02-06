<script lang="ts" setup>
defineProps<{
  label?: string
}>()

const modelValue = defineModel<string>('modelValue', { type: String, default: '' })

const isToggled = ref<boolean>(false)
</script>

<template>
  <div class="grid grid-cols-1 grid-rows-[auto,1fr]">
    <div class="mb-4">
      <InputColorField v-model="modelValue" v-model:toggled="isToggled" :label="label" />
    </div>
    <Collapsible v-model="isToggled">
      <AdvancedColorData :color="modelValue" :labels="true" />
    </Collapsible>
    <HctColorPicker v-model="modelValue" />
  </div>
</template>

<style lang="postcss">
.slider-root.color-input-range {
  --slider-track-height: 16px;
  --slider-handle-width: 20px;
  --slider-handle-height: 20px;
}
</style>
