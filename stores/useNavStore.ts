import type { NavBarItem } from '~/modules/base/types'

const useNavStore = defineStore('nav', () => {
  const state = ref<NavBarItem[]>([
    {
      label: 'Home',
      path: '/',
      icon: ['ic:outline-home-max', 'ic:baseline-home-max']
    },
    {
      label: 'Favorites',
      path: '/favorites',
      icon: ['ic:baseline-favorite-border', 'ic:baseline-favorite']
    },
    {
      label: 'Dialog',
      path: '/dialog',
      icon: ['ic:outline-chat', 'ic:baseline-chat']
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: ['ic:outline-settings', 'ic:baseline-settings']
    }
  ])

  const router = useRouter()

  const active = computed(() =>
    state.value.find((item) => item.path === router.currentRoute.value.path)
  )

  return {
    state,
    active
  }
})

export { useNavStore }
