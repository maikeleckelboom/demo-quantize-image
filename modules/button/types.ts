const buttonVariantNames = [
  'icon',
  'text',
  'outlined',
  'elevated',
  'filled',
  'filledTonal'
] as const

const accentNames = ['primary', 'secondary', 'tertiary', 'surface'] as const

type ButtonVariant = (typeof buttonVariantNames)[number]

type Accent = (typeof accentNames)[number]

type Size = 'sm' | 'md' | 'lg'

type ButtonProps = {
  variant?: ButtonVariant
  accent?: Accent
  size?: Size
  fullWidth?: boolean
  trailingIcon?: string
  leadingIcon?: string
  label?: string
  href?: string
  disabled?: boolean
  loading?: boolean
}

export type { ButtonProps }
