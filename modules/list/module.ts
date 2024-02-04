import { addComponentsDir, createResolver, defineNuxtModule, extendPages } from '@nuxt/kit'

interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'list',
    configKey: 'list'
  },
  setup: async (options: ModuleOptions, nuxt) => {
    const { resolve } = createResolver(import.meta.url)
    // extendPages((pages) => {
    //   pages.push({
    //     name: 'Lists',
    //     path: '/modules/lists',
    //     file: resolve('./runtime/pages/lists.vue')
    //   })
    // })
    await addComponentsDir({
      path: resolve('./runtime/components'),
      pathPrefix: true
    })
  }
})
