import type { ThemeModuleOptions } from '~/modules/theme/types'

export const useThemeConfig = () => {
  const appConfig = useAppConfig() as unknown as {
    theme: Required<ThemeModuleOptions>
  }
  const isDark = computed({
    get: () => appConfig.theme.isDark,
    set: (v) => (appConfig.theme.isDark = v)
  })
  const contrastLevel = computed({
    get: () => appConfig.theme.contrastLevel,
    set: (v) => (appConfig.theme.contrastLevel = v)
  })
  const sourceColor = computed({
    get: () => appConfig.theme.sourceColor,
    set: (v) => (appConfig.theme.sourceColor = v)
  })
  const variant = computed({
    get: () => appConfig.theme.variant,
    set: (v) => (appConfig.theme.variant = v)
  })
  const staticColors = computed({
    get: () => appConfig.theme.staticColors,
    set: (v) => (appConfig.theme.staticColors = v)
  })
  return {
    contrastLevel,
    isDark,
    sourceColor,
    variant,
    staticColors
  }
}
