import { addComponentsDir, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { ThemeModuleOptions } from '~/modules/theme/types'
import type { CvaModuleOptions } from '~/modules/cva/types'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtModule<CvaModuleOptions>({
  meta: {
    name: 'cva',
    configKey: 'cva',
    dependencies: {}
  },
  defaults: {},
  hooks: {},
  setup: async (options: ThemeModuleOptions, nuxt) => {
    await addComponentsDir({
      path: resolve('./runtime/components'),
      extensions: ['vue'],
      prefix: ''
    })
  }
})
