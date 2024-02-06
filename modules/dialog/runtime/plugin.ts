import { type Component, type MaybeRef, shallowRef } from 'vue'
import type { DialogState } from '../types'

export { type DialogState, type Component }

export default defineNuxtPlugin((_nuxt) => {
  const dialogs = shallowRef<DialogState<any, any>[]>([])

  function setRef(id: string, ref: Object | null): void {
    const dialog = dialogs.value.find((dialog) => dialog.id === id)
    if (!dialog) return
    dialog.ref = toRaw(ref)
  }

  async function openDialog<P, R>(
    component: Component,
    props: P
  ): Promise<{ data: R; isCanceled: boolean }> {
    const promise = new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substring(7)
      dialogs.value = [
        ...dialogs.value,
        {
          id,
          component,
          props,
          resolve,
          reject,
          ref: null,
          set: (ref: Object | null) => setRef(id, ref)
        }
      ]
    })

    const { data, isCanceled } = await promise
      .then((data) => ({ data, isCanceled: false }))
      .catch((data) => ({ data, isCanceled: true }))

    return { data, isCanceled }
  }

  async function closeDialog(data?: MaybeRef, unmountDelay: number = 0) {
    let returnValue = toValue(data)

    const dialog = dialogs.value.at(-1)

    if (!dialog) {
      return
    }

    if (unmountDelay) {
      await new Promise((resolve) => setTimeout(resolve, unmountDelay))
    }

    if (returnValue === undefined) {
      if (dialog?.ref?.returnValue) {
        returnValue = dialog.ref.returnValue()
      }
    }

    if ([null, '', undefined].includes(returnValue)) {
      dialog.reject(data)
    }

    if (dialog.resolve) {
      dialog.resolve(returnValue)
    }

    dialogs.value = dialogs.value.filter((d) => d.id !== dialog.id)
  }

  return {
    provide: {
      dialogs: shallowReadonly(dialogs),
      openDialog: openDialog,
      closeDialog: closeDialog
    }
  }
})
