import { KeyColorDialog, SelectColorsDialog } from '#components'

interface DialogOptions {
  type?: 'fullScreen' | 'basic'
  onBeforeClose?: (dialogEl: HTMLDialogElement, backdropEl: HTMLDivElement) => Promise<void> | void
  onBeforeOpen?: (dialogEl: HTMLDialogElement, backdropEl: HTMLDivElement) => Promise<void> | void
  onClosed?: () => void
  onOpened?: () => void
}

interface ColorPickerOptions {
  keyColor: string
  initialColor: number
  onColorChange: (color: number) => void
}

type ColorPickerDialogProps = DialogOptions & ColorPickerOptions

async function openColorPicker(props: ColorPickerDialogProps) {
  const { open } = useDialogs()
  return await open(KeyColorDialog, props)
}

export { openColorPicker }
export type { ColorPickerOptions }

interface SelectColorsProps {
  prominent: Map<number, number>
  seed: number[]
}

async function openSelectColorsDialog(props: SelectColorsProps) {
  const { open } = useDialogs()
  return await open(SelectColorsDialog, props)
}

export { openSelectColorsDialog }
export type { SelectColorsProps, DialogOptions }
