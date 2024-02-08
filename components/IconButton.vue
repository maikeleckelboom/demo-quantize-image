<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    selected?: boolean
    disabled?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    disabled: false,
    selected: false,
    size: 'sm'
  }
)

const button = cva({
  base: [
    'rounded-4xl',
    'bg-transparent',
    'relative',
    'flex',
    'aspect-square',
    'items-center',
    'justify-center',
    'after:inset-0',
    'after:absolute',
    'after:size-full',
    'after:bg-surface-tint/30',
    'after:rounded-4xl',
    'after:opacity-0',
    'after:ease-in-out',
    'icon:text-secondary',
    'icon:pointer-events-none'
  ],
  variants: {
    selected: {
      true: ['after:opacity-100'],
      false: []
    },
    disabled: {
      true: ['cursor-not-allowed', 'pointer-events-none']
    },
    size: {
      sm: ['', 'icon:size-[24px]', 'h-[36px]', 'w-[36px]'],
      md: ['', 'icon:size-[24px]', 'h-[42px]', 'w-[42px]'],
      lg: ['', 'icon:size-[24px]', 'h-[50px]', 'w-[50px]']
    }
  }
})
</script>

<template>
  <button :class="button({ selected, size, disabled })" :disabled="$props.disabled">
    <span class="touch-target">
      <slot></slot>
    </span>
  </button>
</template>

<style scoped>
.touch-target {
  @apply absolute left-1/2 top-1/2 flex size-[48px] -translate-x-1/2 -translate-y-1/2 items-center justify-center;
}
</style>
