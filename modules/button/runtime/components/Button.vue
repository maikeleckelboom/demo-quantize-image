<script lang="ts" setup>
type Intent =
  | 'elevated'
  | 'filled'
  | 'filled-tonal'
  | 'outlined'
  | 'text'
  | 'fab'
  | 'extended-fab'
type Size = 'sm' | 'md' | 'lg'
type Color = 'primary' | 'secondary' | 'tertiary' | 'surface'

interface Props {
  dir?: 'ltr' | 'rtl'
  icon?: string
  intent?: Intent
  size?: Size
  stretch?: boolean
  color?: Color
  disabled?: boolean
}

const variants = cva({
  base: [
    'flex',
    'items-center',
    'justify-center',
    'flex',
    'items-center',
    'justify-center',
    'gap-3',
    'shrink-0',
    'relative',
    'overflow-hidden',
    'before:z-0',
    'before:opacity-0',
    'before:content',
    'before:absolute',
    'before:inset-0',
    'before:bg-current',
    'before:pointer-events-none',
    'hover:before:opacity-[0.08]',
    'hover:before:active:opacity-[0.18]',
    'active:before:opacity-[0.16]',
    'label-text:text-ellipsis',
    'label-text:font-semibold',
    'label-text:capitalize',
    'label-text:shrink-0',
    'icon:shrink-0'
  ],
  variants: {
    dir: {
      ltr: 'flex-row',
      rtl: 'flex-row-reverse'
    },
    stretch: {
      true: 'w-full',
      false: 'w-fit'
    },
    disabled: {
      true: [
        'bg-surface-level/20',
        'opacity-50',
        'text-on-surface-level-2',
        'cursor-not-allowed',
        'pointer-events-none'
      ],
      false: []
    },
    intent: {
      elevated: [
        'bg-surface-level-2',
        'text-primary',
        'shadow-lg',
        'shadow-shadow',
        'hover:shadow-xl',
        'active:shadow-lg '
      ],
      filled: ['bg-primary', 'text-on-primary'],
      'filled-tonal': ['bg-secondary-container', 'text-on-secondary-container'],
      outlined: ['bg-transparent', 'text-primary', 'border', 'border-outline-variant'],
      text: ['bg-transparent', 'label-text:text-primary'],
      fab: [
        // ...
      ],
      'extended-fab': [
        // ...
      ]
    },
    size: {
      sm: ['px-5', 'label-text:text-sm', 'h-[38px]', 'icon:w-[24px]', 'icon:h-[24px]'],
      md: [
        'label-text:text-base',
        'py-5',
        'px-5',
        'icon:w-[24px]',
        'icon:h-[24px]',
        'h-[38px]'
      ],
      lg: ['label-text:text-lg', 'p-5', 'icon:w-[24px]', 'icon:h-[24px]', 'h-[56px]']
    },
    color: {
      primary: '',
      secondary: '',
      tertiary: '',
      surface: ''
    }
  },
  compoundVariants: [
    {
      intent: ['fab', 'extended-fab'],
      color: 'primary',
      class: 'bg-primary-container text-on-primary-container'
    },
    {
      intent: ['fab', 'extended-fab'],
      color: 'secondary',
      class: 'bg-secondary-container text-on-secondary-container'
    },
    {
      intent: ['fab', 'extended-fab'],
      color: 'tertiary',
      class: 'bg-tertiary-container text-on-tertiary-container'
    },
    {
      intent: ['fab', 'extended-fab'],
      color: 'surface',
      class: 'bg-surface-level-2 text-on-surface-level-2'
    },
    {
      intent: ['elevated', 'filled', 'filled-tonal', 'outlined', 'text'],
      class: 'rounded-full'
    },
    {
      intent: 'fab',
      size: 'sm',
      class: 'rounded-xl h-[40px] w-[40px] icon:w-[24px] icon:h-[24px]'
    },
    {
      intent: 'fab',
      size: 'md',
      class: 'rounded-2xl h-[56px] w-[56px] icon:w-[24px] icon:h-[24px]'
    },
    {
      intent: 'fab',
      size: 'lg',
      class: 'rounded-3.5xl h-[96px] w-[96px] icon:w-[40px] icon:h-[40px]'
    },
    {
      intent: 'extended-fab',
      size: 'sm',
      class: 'rounded-xl h-[40px] icon:w-[24px] icon:h-[24px]'
    },
    {
      intent: 'extended-fab',
      size: 'md',
      class: 'rounded-2xl h-[56px] icon:w-[24px] icon:h-[24px]'
    },
    {
      intent: 'extended-fab',
      size: 'lg',
      class: 'rounded-3.5xl h-[96px] icon:w-[40px] icon:h-[40px]'
    }
  ]
})

const props = withDefaults(defineProps<Props>(), {
  intent: 'filled',
  size: 'md',
  dir: 'ltr',
  disabled: false
})

const buttonClasses = computed(() => twMerge(variants(props)))
</script>

<template>
  <button :class="buttonClasses">
    <slot name="icon">
      <Icon v-if="icon" :name="icon" />
    </slot>
    <slot />
  </button>
</template>
