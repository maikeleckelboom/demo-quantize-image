type ButtonProps = {
  label: string
  icon: string
  intent: 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text' | 'icon'
  size: 'sm' | 'md' | 'lg'
  disabled: boolean
  stretch: boolean
}

export type { ButtonProps }
