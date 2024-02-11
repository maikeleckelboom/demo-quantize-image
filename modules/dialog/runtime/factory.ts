import { KeyColorDialog, SelectColorsDialog } from '#components'

interface ColorPickerOptions {
  keyColor: string
  initialColor: number
  onColorChange: (color: number) => void
}

type DialogOptions = {
  type?: 'basic' | 'fullScreen'
}

async function openColorPicker({
  keyColor,
  initialColor,
  onColorChange,
  type
}: ColorPickerOptions & DialogOptions) {
  const { open } = useDialogs()
  return await open(KeyColorDialog, { keyColor, initialColor, onColorChange, type })
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
export type { SelectColorsProps }
