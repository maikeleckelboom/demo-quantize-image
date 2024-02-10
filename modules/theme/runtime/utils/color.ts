import {
  argbFromHex,
  DynamicColor,
  DynamicScheme,
  Hct,
  MaterialDynamicColors,
  rgbaFromArgb
} from '@material/material-color-utilities'
import { capitalize } from 'vue'
import type { Variant } from '~/modules/theme/types'
import { SCHEME_VARIANTS } from '~/modules/theme/types'

const schemeVariants = Object.keys(SCHEME_VARIANTS) as (keyof typeof SCHEME_VARIANTS)[]

function getColorAsHct(color: Hct | string | number): Hct {
  if (typeof color === 'number') {
    return Hct.fromInt(color)
  } else if (typeof color === 'string') {
    return Hct.fromInt(argbFromHex(color))
  }
  return color
}

function groupByBaseColor(colors: Record<string, number>): Record<string, Record<string, number>> {
  return Object.entries(colors).reduce(
    (acc, [key, value]) => {
      const splitCamelCase = key
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase()
        .split('-')
      const removedOn = splitCamelCase.filter((item) => item !== 'on')
      const [baseColor] = removedOn
      const baseColorValue = acc[baseColor] || {}
      baseColorValue[key] = value
      acc[baseColor] = baseColorValue
      return acc
    },
    {} as Record<string, Record<string, number>>
  )
}

function makeDynamicScheme(
  sourceColor: Hct | string | number,
  isDark: boolean,
  contrastLevel: number,
  variant: Variant,
  include: ('system' | 'light' | 'dark')[] = ['system', 'light', 'dark']
) {
  const Scheme = SCHEME_VARIANTS[variant]
  if (!Scheme) throw new Error(`Invalid scheme variant: ${variant}`)
  const schemes = new Map<'system' | 'light' | 'dark', DynamicScheme>()
  const sourceColorHct = getColorAsHct(sourceColor)
  if (!include.length || include.includes('system')) {
    schemes.set('system', new Scheme(sourceColorHct, isDark, contrastLevel))
  }
  if (include.includes('light')) {
    schemes.set('light', new Scheme(sourceColorHct, false, contrastLevel))
  }
  if (include.includes('dark')) {
    schemes.set('dark', new Scheme(sourceColorHct, true, contrastLevel))
  }
  return schemes
}

function colorsFromDynamicSchemeMap(
  dynamicSchemes: Map<'system' | 'light' | 'dark', DynamicScheme>
) {
  return Array.from(dynamicSchemes.entries()).reduce(
    (acc, [key, value]) => ({
      ...acc,
      ...colorsFromDynamicScheme(value, key !== 'system' ? `${capitalize(key)}` : '')
    }),
    {}
  )
}

function colorsFromDynamicScheme(
  dynamicScheme: Map<'system' | 'light' | 'dark', DynamicScheme> | DynamicScheme,
  suffix?: string
): Record<string, number> {
  if (dynamicScheme instanceof Map) {
    return colorsFromDynamicSchemeMap(dynamicScheme)
  }
  const schemeContentColors: Record<string, number> = {}
  for (const colorName of Object.getOwnPropertyNames(MaterialDynamicColors)) {
    const color = MaterialDynamicColors[colorName as keyof typeof MaterialDynamicColors]
    if (color instanceof DynamicColor) {
      const colorKey = suffix ? `${colorName}${suffix && suffix}` : colorName
      schemeContentColors[colorKey] = color.getArgb(dynamicScheme)
    }
  }
  return schemeContentColors
}

function propertiesFromColors(schemeColors: Record<string, number>, options: {} = {}) {
  return Object.keys(schemeColors).reduce(
    (acc, key) => {
      const { r, g, b } = rgbaFromArgb(schemeColors[key])
      const kebabKey = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
      acc[`--${kebabKey}-rgb`] = `${r} ${g} ${b}`
      return acc
    },
    {} as Record<string, string>
  )
}

function textFromProperties(
  properties: Record<string, string>[] | Record<string, string>,
  options?: {
    lineBreak?: boolean
  }
): string {
  if (Array.isArray(properties)) {
    return properties.map((property) => textFromProperties(property)).join('')
  }
  return Object.entries(properties)
    .map(([name, value]) => {
      return `${name}: ${value};`
    })
    .join(options?.lineBreak ? '\n' : '')
}

const repeatingLinearGradient = (() => {
  const { primary, secondary, tertiary } = {
    primary: 'rgb(var(--primary-rgb))',
    secondary: 'rgb(var(--tertiary-rgb))',
    tertiary: 'rgb(var(--secondary-rgb))'
  }
  return `repeating-linear-gradient(to right,${primary} 0%,${secondary} 50%,${tertiary} 100%)`
})()

export {
  getColorAsHct,
  makeDynamicScheme,
  colorsFromDynamicScheme,
  propertiesFromColors,
  textFromProperties,
  groupByBaseColor,
  repeatingLinearGradient,
  repeatingRadialGradient,
  schemeVariants
}
