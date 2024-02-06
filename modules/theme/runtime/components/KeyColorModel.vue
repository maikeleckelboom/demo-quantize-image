<script lang="ts" setup>
import { hexFromArgb } from '@material/material-color-utilities'

defineProps<{
  label?: string
}>()

const modelValue = defineModel<number>('modelValue', { type: Number, default: 0 })

const isToggled = ref<boolean>(false)
</script>

<template>
  <div class="grid">
    <InputColorField v-model="modelValue" v-model:toggled="isToggled" :label="label" />
    <Collapsible v-model="isToggled">
      <AdvancedColorData :color="hexFromArgb(modelValue)" :labels="false" />
    </Collapsible>
    <ColorPicker v-model="modelValue" />
  </div>
</template>

<style lang="postcss">
.slider-root.color-input-range {
  --slider-track-height: 16px;
  --slider-handle-width: 20px;
  --slider-handle-height: 20px;
}
</style>
