import { addComponentsDir, addImportsDir, createResolver, defineNuxtModule, extendPages } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

interface ModuleOptions {
}

const runtimeDir: string = './runtime' as const

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'slider',
    configKey: 'slider',
    dependencies: {}
  },
  defaults: {},
  setup: async (options: ModuleOptions, nuxt) => {
    nuxt.options.css = nuxt.options.css || []
    nuxt.options.css.push(resolve(`${runtimeDir}/css/index.css`))

    console.log('css?', nuxt.options.css)

    await addComponentsDir({
      path: resolve(`${runtimeDir}/components`)
    })

    addImportsDir(resolve(`${runtimeDir}/composables`))
    addImportsDir(resolve(`${runtimeDir}/utils`))
    extendPages((pages) => {
      pages.push({
        name: 'slider',
        path: '/modules/slider',
        file: resolve('./runtime/pages/index.vue')
      })
    })
  }
})
