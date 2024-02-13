import { addComponentsDir, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { ThemeModuleOptions } from '~/modules/theme/types'

const { resolve } = createResolver(import.meta.url)

const runtimeDir = './runtime' as const

export default defineNuxtModule<ThemeModuleOptions>({
  meta: {
    name: 'theme',
    configKey: 'theme',
    dependencies: {
      tailwindcss: '^3.4.1',
      '@material/material-color-utilities': '^0.2.7',
      'chroma-js': '^2.4.2'
    }
  },
  defaults: {
    sourceColor: '#ffd700',
    isDark: false,
    variant: 'content',
    contrastLevel: 0.35,
    staticColors: [
      {
        blend: true,
        name: 'Indigo',
        value: '#5c6ac4'
      }
    ]
  },
  hooks: {
    'imports:dirs'(dirs) {
      dirs.push(resolve('./runtime/composables'), resolve('./runtime/utils'))
    }
  },
  setup: async (options: ThemeModuleOptions, nuxt) => {
    /*
      nuxt.options.appConfig.theme = defu(nuxt.options.appConfig?.theme || {}, options)
    */
    addPlugin({ src: resolve(`${runtimeDir}/plugin.ts`) })

    await addComponentsDir({
      pathPrefix: false,
      path: resolve(`${runtimeDir}/components`)
    })
  }
})
