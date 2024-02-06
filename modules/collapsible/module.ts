import { addComponentsDir, createResolver, defineNuxtModule } from '@nuxt/kit'

interface ModuleOptions {}

const { resolve } = createResolver(import.meta.url)

const runtimeDir = './runtime' as const

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'collapsible',
    configKey: 'collapsible',
    dependencies: {}
  },
  defaults: {},
  setup: async (options: ModuleOptions, nuxt) => {
    await addComponentsDir({
      path: resolve(`${runtimeDir}/components`),
      extensions: ['vue'],
      prefix: ''
    })
  }
})
