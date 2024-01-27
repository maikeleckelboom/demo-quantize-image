<script lang="ts" setup>
interface ButtonProps {
  variant?: 'icon' | 'text' | 'outlined' | 'filled' | 'filled-tonal'
}

const props = defineProps<Partial<ButtonProps>>()
</script>

<template>
  <span data-touch-target>
      <button type="button">
      <slot/>
    </button>
  </span>
</template>
