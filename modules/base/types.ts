type Badge = {
  label: string | number
  type: 'large' | 'small'
}

type NavBarItem = {
  label: string
  icon: string | string[]
  path: string
  badge?: Badge
}

export type { NavBarItem }
