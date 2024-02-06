import { addComponent, createResolver, defineNuxtModule } from '@nuxt/kit'

interface ModuleOptions {}

const { resolve } = createResolver(import.meta.url)

const runtimeDir = './runtime' as const

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'chip',
    configKey: 'chip',
    dependencies: {}
  },
  defaults: {},
  setup: async (options: ModuleOptions, nuxt) => {
    await addComponent({
      name: 'Chip',
      filePath: resolve(`${runtimeDir}/Chip.vue`)
    })
  }
})
