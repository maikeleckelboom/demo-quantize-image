import {
  addComponentsDir,
  createResolver,
  defineNuxtModule,
  extendPages
} from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

interface ModuleOptions {}

const runtimeDir: string = './runtime' as const

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'button',
    configKey: 'button',
    dependencies: {}
  },
  defaults: {},
  hooks: {},
  setup: async (options: ModuleOptions, nuxt) => {
    await addComponentsDir({
      path: resolve(`${runtimeDir}/components`),
      extensions: ['vue'],
      prefix: ''
    })
    extendPages((pages) => {
      pages.push({
        name: 'slider',
        path: '/modules/button',
        file: resolve(`${runtimeDir}/pages/index.vue`)
      })
    })
  }
})
