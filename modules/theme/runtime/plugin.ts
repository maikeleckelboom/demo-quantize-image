import { colorsFromDynamicScheme, makeDynamicScheme, propertiesFromColors } from '~/modules/theme/runtime/utils/color'

export default defineNuxtPlugin((nuxt) => {
  const { sourceColor, isDark, contrastLevel, variant } = useThemeConfig()

  const dynamicSchemes = computed(() =>
    makeDynamicScheme(sourceColor.value, isDark.value, contrastLevel.value, variant.value, ['system', 'light', 'dark'])
  )

  const dynamicScheme = computed(() => {
    if (!dynamicSchemes.value) return
    return dynamicSchemes.value.get(isDark.value ? 'dark' : 'light')
  })

  const dynamicSchemesColors = computed(() => {
    if (!dynamicSchemes.value) return
    return colorsFromDynamicScheme(dynamicSchemes.value)
  })

  const schemeColorProperties = computed(() => {
    if (!dynamicSchemesColors.value) return
    return propertiesFromColors(dynamicSchemesColors.value)
  })

  const schemeCssVariables = computed(() =>
    schemeColorProperties.value ? textFromProperties(schemeColorProperties.value, { lineBreak: true }) : ''
  )

  useHead({
    htmlAttrs: {
      class: computed(() => (isDark.value ? 'dark' : 'light'))
    },
    style: [
      {
        textContent: computed(() => `:root {\n${schemeCssVariables.value}\n}`)
      }
    ]
  })

  nuxt.provide('dynamicSchemes', dynamicSchemes)
  nuxt.provide('dynamicScheme', dynamicScheme)
  nuxt.provide('schemeCssVariables', schemeCssVariables)
  nuxt.provide('isDark', isDark)
})
