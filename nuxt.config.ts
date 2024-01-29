export default defineNuxtConfig({
  devtools: { enabled: true },

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
    }
  },

  icon: {
    size: '24px'
  },

  viewport: {
    breakpoints: {
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

  imports: {
    dirs: ['~/utils', '~/composables']
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/device',
    'nuxt-icon',
    'nuxt-viewport',
    '~/modules/theme/module.ts',
    '~/modules/slider/module.ts'
  ]
})
