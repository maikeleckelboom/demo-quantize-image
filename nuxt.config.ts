export default defineNuxtConfig({
  devtools: {
    enabled: true
  },

  experimental: {
    viewTransition: true
  },

  typescript: {
    typeCheck: false,
    strict: true
  },

  runtimeConfig: {
    public: {
      apiUrl: 'http://127.0.0.1:8000/api/v1'
    }
  },

  css: ['~/assets/css/images.css'],

  tailwindcss: {
    viewer: false,
    configPath: '~/tailwind.config',
    exposeConfig: true
  },

  vueuse: {
    autoImports: true
  },

  appConfig: {
    theme: {
      isDark: true,
      variant: 'content',
      contrastLevel: 0.35,
      sourceColor: '#7498d0',
      staticColors: [
        {
          name: 'Honeydew',
          value: '#f0fff4',
          blend: true
        }
      ]
    },
    nuxtIcon: {
      size: '24px'
    }
  },

  viewport: {
    breakpoints: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    },
    defaultBreakpoints: {
      mobile: 'sm',
      tablet: 'md',
      desktop: 'lg'
    },
    fallbackBreakpoint: 'lg'
  },

  components: [
    {
      path: '~/components',
      pathPrefix: true
    }
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/device',
    'nuxt-icon',
    'nuxt-viewport',
    '~/modules/theme/module.ts',
    '~/modules/slider/module.ts',
    '~/modules/json-pretty/module.ts',
    '~/modules/button/module.ts',
    '~/modules/list/module.ts',
    '~/modules/tree/module.ts',
    '~/modules/base/module.ts',
    '~/modules/chip/module.ts',
    '~/modules/collapsible/module.ts',
    '~/modules/dialog/module.ts'
  ],

  imports: {
    dirs: ['~/utils', '~/utils/directives/*', '~/composables', '~/stores'],
    presets: [
      {
        from: 'tailwind-merge',
        imports: ['twMerge']
      },
      {
        from: 'cva',
        imports: ['cva']
      }
    ]
  }
})
