import { openDialog } from '~/modules/dialog/runtime/plugin'
import type { Component } from 'vue'

export function createDialog<P, R>(
  component: Component
): (props: P) => Promise<{ data: R; isCanceled: boolean }> {
  return (props: P): Promise<{ data: R; isCanceled: boolean }> => openDialog<P, R>(component, props)
}
