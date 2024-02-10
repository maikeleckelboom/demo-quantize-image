import { KeyColorDialog, SelectColorsDialog } from '#components'

interface ColorPickerOptions {
  keyColor: string
  initialColor: number
  onColorChange: (color: number) => void
}

async function openColorPicker({ keyColor, initialColor, onColorChange }: ColorPickerOptions) {
  const { open } = useDialogs()
  return await open(KeyColorDialog, { keyColor, initialColor, onColorChange })
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
