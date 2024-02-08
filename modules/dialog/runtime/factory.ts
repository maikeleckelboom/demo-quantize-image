import KeyColorDialog from '~/modules/theme/runtime/components/ColorPicker/KeyColorDialog.vue'
import ColorSelectDialog from '~/components/FileProcessDialog.vue'

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

interface FileProcessOptions {
  /*  prominentColors: Map<number, number> | null
    seedColors: number[] | null*/
  file: File
}

async function openFileProcessDialog(props: FileProcessOptions) {
  const { open } = useDialogs()
  return await open(ColorSelectDialog, props)
}

export { openFileProcessDialog }
export type { FileProcessOptions }
