import { addComponentsDir, createResolver, defineNuxtModule, extendPages } from '@nuxt/kit'

interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'tree',
    configKey: 'tree',
    dependencies: {}
  },
  defaults: {},
  hooks: {},
  setup: async (options: ModuleOptions, nuxt) => {
    const { resolve } = createResolver(import.meta.url)
    extendPages((pages) => {
      pages.push({
        name: 'tree',
        path: '/modules/tree',
        file: resolve('./runtime/pages/tree.vue')
      })
    })
    await addComponentsDir({
      path: resolve('./runtime/components'),
      pathPrefix: true
    })
  }
})
