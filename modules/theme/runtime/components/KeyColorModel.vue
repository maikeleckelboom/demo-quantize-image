<script lang="ts" setup>
const { sourceColor } = useThemeConfig()
const isToggled = ref<boolean>(false)
</script>

<template>
  <div class="key-color-model-grid mt-8">
    <div id="key-color-input">
      <InputColorField v-model="sourceColor" v-model:toggled="isToggled" />
    </div>
    <div id="key-color-data">
      <AdvancedColorData v-if="isToggled" :color="sourceColor" />
    </div>
    <div id="key-color-input-group">
      <HCTModelColorPicker />
    </div>
  </div>
</template>

<style lang="postcss">
.key-color-model-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
}

.slider-root.color-input-range {
  --slider-track-height: 12px;
  --slider-handle-width: 20px;
  --slider-handle-height: 20px;
}
</style>
