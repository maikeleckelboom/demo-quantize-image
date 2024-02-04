type ListItemBase = {
  label: string
  [key: string]: any
}

type NavigationListItemLink = {
  href: string
  children?: never
  open?: never
}

type NavigationListItemButton = {
  href?: never
  children: NavigationListItem[]
  open: boolean
}

type MaybeRecursiveListItem =
  | ListItemBase
  | (ListItemBase & (NavigationListItemLink | NavigationListItemButton))

type NavigationListItem = MaybeRecursiveListItem

export type {
  NavigationListItem,
  NavigationListItemLink,
  NavigationListItemButton,
  MaybeRecursiveListItem
}
