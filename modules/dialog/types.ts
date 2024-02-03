import type { ButtonProps } from '~/modules/button/types'

type Title = {
  title: string
}

type Text = {
  text: string
}

type Icon = {
  icon: string
}

type ContentProps = Title | Text | (Title & Text)

type ActionBtn = Partial<ButtonProps> & {
  onClick: (...args: any) => any
}

type DialogProps = Partial<{
  headline: string
  text: string
  icon: string
  intent: 'basic' | 'full-screen'
  divider: 'top' | 'bottom' | 'both'
  closeAffordance: boolean
  responsive: boolean
  actions: ActionBtn[]
}>

export type { DialogProps, ActionBtn }
