import { addComponentsDir, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { ThemeModuleOptions } from '~/modules/theme/types'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtModule<ThemeModuleOptions>({
  meta: {
    name: 'button',
    configKey: 'button',
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
