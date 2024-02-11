<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    variant?: 'surface' | 'outlined' | 'text'
    selected?: boolean
    disabled?: boolean
    readonly?: boolean
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    variant: 'surface',
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
    variant: {
      outlined: ['border', 'border-outline-variant'],
      surface: ['border', 'border-transparent'],
      text: ['border-none']
    },
    disabled: {
      true: ['cursor-not-allowed', 'pointer-events-none', 'after:opacity-20']
    },
    size: {
      sm: ['', 'icon:size-[20px]', 'h-[38px]', 'w-[38px]'],
      md: ['', 'icon:size-[24px]', 'h-[40px]', 'w-[40px]'],
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
    :class="button({ selected, size, disabled, variant, class: $attrs?.class ?? '' })"
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
