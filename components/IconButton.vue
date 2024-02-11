<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    selected?: boolean
    disabled?: boolean
    readonly?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    disabled: false,
    readonly: false,
    selected: false,
    size: 'sm'
  }
)

const button = cva({
  base: [
    'rounded-4xl',
    'bg-transparent',
    'relative',
    'overflow-clip',
    'flex',
    'aspect-square',
    'items-center',
    'justify-center',
    'after:inset-0',
    'after:absolute',
    'after:size-full',
    'after:bg-secondary-container',
    'after:opacity-0',
    'after:ease-in-out',
    'after:-z-10',
    'icon:pointer-events-none',
    'hover:after:opacity-20',
    'active:after:opacity-40',
    'focus-visible:after:opacity-20',
    'focus-visible:after:ring-2'
  ],
  variants: {
    selected: {
      true: [],
      false: []
    },
    disabled: {
      true: ['cursor-not-allowed', 'pointer-events-none', 'after:opacity-20']
    },
    size: {
      sm: ['', 'icon:size-[20px]', 'h-[36px]', 'w-[36px]'],
      md: ['', 'icon:size-[24px]', 'h-[42px]', 'w-[42px]'],
      lg: ['', 'icon:size-[24px]', 'h-[50px]', 'w-[50px]']
    }
  }
})
</script>

<template>
  <button
    :aria-disabled="$props.disabled"
    :aria-pressed="selected"
    :aria-selected="selected"
    :class="button({ selected, size, disabled, class: $attrs?.class ?? '' })"
    :disabled="$props.disabled"
    :readonly="$props.readonly"
    role="button"
    type="button"
  >
    <span
      class="absolute left-1/2 top-1/2 flex size-[48px] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
    >
      <slot />
    </span>
  </button>
</template>
