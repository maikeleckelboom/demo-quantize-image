import type { DialogModuleOptions, DialogState } from '~/modules/dialog/types'
import type { Component, ShallowRef } from 'vue'

declare module '#app' {
  interface NuxtApp {
    $dialogs: ShallowRef<DialogState<any, any>[]>
    $openDialog: <Props, ReturnValue>(
      component: Component,
      props: Props
    ) => Promise<{ data: ReturnValue; isCanceled: boolean }>
    $closeDialog: (data?: any, unmountDelay?: number) => void
  }

  interface RuntimeConfig {
    public: {
      dialog: DialogModuleOptions
    }
  }

  interface AppConfigInput {
    dialog: DialogModuleOptions
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $dialogs: ShallowRef<DialogState<any, any>[]>
  }
}

export {}
