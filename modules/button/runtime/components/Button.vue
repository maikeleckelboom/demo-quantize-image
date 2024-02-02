<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    variant?: 'text' | 'elevated' | 'filled' | 'filledTonal' | 'outlined' | 'icon'
  }>(),
  {
    variant: 'text'
  }
)
</script>

<template>
  <button :class="`v-variant-${variant}`" class="button" type="button">
    <slot name="trailingIcon" />
    <slot name="icon" />
    <slot></slot>
    <slot name="trailingIcon" />
  </button>
</template>

<style scoped>
.button {
  @apply relative inline-flex items-center justify-center rounded-4xl border border-transparent text-label-lg;
  @apply opacity-0 after:pointer-events-none after:absolute after:inset-0 after:z-20 after:rounded-4xl after:bg-primary;
  @apply hover:after:opacity-50;

  &:hover {
    @apply after:opacity-100;
  }

  &:focus {
    @apply after:opacity-100;
  }
}

button:slotted(.icon) {
  margin-right: 0.25em;
}

button:has(.icon) {
}
</style>
