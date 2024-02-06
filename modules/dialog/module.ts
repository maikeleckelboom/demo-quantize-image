import { addComponentsDir, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { DialogModuleOptions } from '~/modules/dialog/types'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtModule<DialogModuleOptions>({
  meta: {
    name: 'dialog',
    configKey: 'dialog',
    dependencies: {}
  },
  hooks: {
    'imports:dirs'(dirs) {
      dirs.push(resolve('./runtime/composables'))
    }
  },
  setup: async (options: DialogModuleOptions, nuxt) => {
    addPlugin({ src: resolve('./runtime/plugin') })
    await addComponentsDir({
      pathPrefix: false,
      path: resolve('./runtime/components')
    })
  }
})
