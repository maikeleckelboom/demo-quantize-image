import { addComponent, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { ThemeModuleOptions } from '~/modules/theme/types'

const { resolve } = createResolver(import.meta.url)

const runtimeDir = './runtime' as const

export default defineNuxtModule<ThemeModuleOptions>({
  meta: {
    name: 'json-pretty',
    configKey: 'json-pretty',
    dependencies: {
      'vue-json-pretty': '^2.1.0'
    }
  },
  defaults: {},
  hooks: {},
  setup: async (options: ThemeModuleOptions, nuxt) => {
    nuxt.options.css = nuxt.options.css || []
    nuxt.options.css.push(resolve(`${runtimeDir}/vue-json-pretty.css`))
    await addComponent({
      name: 'JsonPretty',
      filePath: resolve(`${runtimeDir}/JsonPretty.vue`)
    })
  }
})
