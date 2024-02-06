import type { ButtonProps } from '~/modules/button/types'
import type { Component, PropType } from 'vue'

type ActionBtn = Partial<ButtonProps> & {
  click: (...args: any) => any
}

type DialogProps = Partial<{
  title: string
  text: string
  icon: string
  variant: 'basic' | 'full-screen'
  divider: 'top' | 'bottom' | 'both'
  closeAffordance: boolean
  responsive: boolean
  actions: ActionBtn[]
}>

interface DialogState<P extends PropType<any>, R> {
  id: string
  ref: null | any
  component: Component
  props: P
  resolve: (value: R) => void
  reject: (reason?: string) => void
  set: (ref: Object | null) => void
}

interface DialogModuleOptions {}

export type { DialogModuleOptions, DialogProps, DialogState, ActionBtn }
