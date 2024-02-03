import type { Ref } from 'vue'
import type { DynamicScheme } from '@material/material-color-utilities'
import type { ThemeModuleOptions } from '~/modules/theme/types'

declare module '#app' {
  interface NuxtApp {
    $dynamicScheme: Ref<DynamicScheme>
    $dynamicSchemes: Ref<Map<'system' | 'light' | 'dark', DynamicScheme>>
    $schemeCssVariables: Ref<string>
  }

  interface RuntimeConfig {
    public: {
      theme: ThemeModuleOptions
    }
  }

  interface AppConfigInput {
    theme: ThemeModuleOptions
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $dynamicScheme: Ref<DynamicScheme>
    $dynamicSchemes: Ref<Map<'system' | 'light' | 'dark', DynamicScheme>>
    $schemeCssVariables: Ref<string>
  }
}

export {}
