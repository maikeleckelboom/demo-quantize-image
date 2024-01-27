import {
  SchemeContent,
  SchemeExpressive,
  SchemeFidelity,
  SchemeMonochrome,
  SchemeNeutral,
  SchemeVibrant
} from '@material/material-color-utilities'

const SCHEME_VARIANTS = {
  content: SchemeContent,
  expressive: SchemeExpressive,
  fidelity: SchemeFidelity,
  monochrome: SchemeMonochrome,
  neutral: SchemeNeutral,
  vibrant: SchemeVibrant
  // fruit_salad: SchemeFruitSalad,
  // rainbow: SchemeRainbow,
} as const

type Variant = keyof typeof SCHEME_VARIANTS

interface ThemeModuleOptions {
  isDark?: boolean
  sourceColor?: string
  contrastLevel?: number
  variant?: Variant
  staticColors?: {
    name: string
    value: string
    blend?: boolean
  }[]
}

type ColorModeOption = {
  label: string
  value: string
  selected: boolean
}

// type Variant = Pick<ThemeModuleOptions, 'variant'>
type StaticColor = Pick<ThemeModuleOptions, 'staticColors'>['staticColors']

export type { Variant, StaticColor, ThemeModuleOptions, ColorModeOption }
export { SCHEME_VARIANTS }
