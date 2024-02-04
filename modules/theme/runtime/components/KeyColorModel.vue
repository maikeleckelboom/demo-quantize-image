<script lang="ts" setup>
const { sourceColor } = useThemeConfig()
const isToggled = ref<boolean>(false)
defineProps<{
  label?: string
}>()
</script>

<template>
  <div class="grid grid-cols-1 grid-rows-[auto,1fr]">
    <InputColorField v-model="sourceColor" v-model:toggled="isToggled" :label="label" />
    <Collapsible v-model:open="isToggled">
      <AdvancedColorData :color="sourceColor" :labels="true" />
    </Collapsible>
    <HctColorPicker v-model="sourceColor" />
  </div>
</template>

<style lang="postcss">
.slider-root.color-input-range {
  --slider-track-height: 12px;
  --slider-handle-width: 20px;
  --slider-handle-height: 20px;
}
</style>
