import type { NavBarItem } from '~/modules/base/types'

const useNavStore = defineStore('nav', () => {
  const state = ref<NavBarItem[]>([
    {
      label: 'Home',
      path: '/',
      icon: ['ic:outline-home-max', 'ic:baseline-home-max'],
      badge: '99+'
    },
    {
      label: 'Favorites',
      path: '/favorites',
      icon: ['ic:baseline-favorite-border', 'ic:baseline-favorite'],
      badge: 'new'
    },
    {
      label: 'Dialog',
      path: '/dialog',
      icon: ['ic:outline-chat', 'ic:baseline-chat'],
      badge: 5
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: ['ic:outline-settings', 'ic:baseline-settings'],
      badge: 3
    }
  ])

  const router = useRouter()

  const active = computed(() =>
    state.value.find((item) => item.path === router.currentRoute.value.path)
  )

  const isLabelled = ref<boolean>(false)

  function toggleLabelled() {
    isLabelled.value = !isLabelled.value
  }

  return {
    state,
    active,
    isLabelled,
    toggleLabelled
  }
})

export { useNavStore }
