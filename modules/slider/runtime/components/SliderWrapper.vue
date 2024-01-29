<script lang="ts" setup>
defineSlots<{
  default: void
  before: void
  after: void
}>()
</script>

<template>
  <div class="slider-frame">
    <div class="slider-frame-leading-slot">
      <slot name="before" />
    </div>
    <div class="slider-frame-default-slot">
      <slot />
    </div>
    <div class="slider-frame-trailing-slot">
      <slot name="after" />
    </div>
  </div>
</template>

<style scoped>
.slider-frame {
  display: grid;
  align-items: center;
  gap: 8px;

  &:has(.v-horizontal) {
    grid-template-columns: auto 1fr auto;
    grid-template-areas: 'leading body trailing';
  }

  &:has(.v-vertical) {
    grid-template-rows: auto 1fr auto;
    grid-template-areas: 'leading' 'body' 'trailing';
  }

  .slider-frame-trailing-slot {
    grid-area: trailing;
  }

  .slider-frame-leading-slot {
    grid-area: leading;
  }

  .slider-frame-default-slot {
    grid-area: body;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
</style>
