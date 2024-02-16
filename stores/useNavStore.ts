import type { NavBarItem } from '~/modules/base/types'

const useNavStore = defineStore('nav', () => {
  const state = ref<NavBarItem[]>([
    {
      label: 'Home',
      path: '/',
      icon: ['ic:outline-home-max', 'ic:baseline-home-max']
    },
    /*{
      label: 'Favorites',
      path: '/favorites',
      icon: ['ic:baseline-favorite-border', 'ic:baseline-favorite']
    },*/
    {
      label: 'Colors',
      path: '/colors',
      icon: ['ic:baseline-colorize', 'ic:baseline-colorize']
    },
    {
      label: 'Quantize',
      path: '/quantize',
      icon: ['ic:baseline-image', 'ic:baseline-image'],
      badge: {
        label: 'new',
        type: 'large'
      }
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: ['ic:outline-settings', 'ic:baseline-settings'],
      badge: {
        label: 1,
        type: 'small'
      }
    }
  ])

  const router = useRouter()

  const exactActive = computed(() =>
    state.value.find((item) => item.path === router.currentRoute.value.path)
  )

  const active = computed(() =>
    state.value.find((item) => router.currentRoute.value.path.startsWith(item.path))
  )

  const isLabeled = ref<boolean>(true)

  const possibleBackgroundTokens = ['bg-surface', 'bg-surface-container', 'bg-surface-variant'] as const
  const backgroundToken = ref<(typeof possibleBackgroundTokens)[number]>('bg-surface')
  const textToken = computed(() =>
    ['text', 'on', ...backgroundToken.value.split('-').slice(1)].join('-')
  )

  function toggleLabeled() {
    isLabeled.value = !isLabeled.value
  }

  return {
    state,
    active,
    exactActive,
    isLabeled,
    toggleLabeled,
    possibleBackgroundTokens,
    backgroundToken,
    textToken
  }
})

export { useNavStore }
