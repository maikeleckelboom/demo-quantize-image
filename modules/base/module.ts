import {
  addComponentsDir,
  createResolver,
  defineNuxtModule,
  extendPages
} from '@nuxt/kit'

interface ModuleOptions {}

const { resolve } = createResolver(import.meta.url)

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'base',
    configKey: 'base',
    dependencies: {}
  },
  defaults: {},
  setup: async (options: ModuleOptions, nuxt) => {
    await addComponentsDir({
      path: resolve('./runtime/components'),
      extensions: ['vue'],
      prefix: ''
    })
    extendPages((pages) => {
      pages.push({
        path: '/base',
        file: resolve('./runtime/pages/base.vue')
      })
    })
  }
})
