import { FileProcessDialog, KeyColorDialog } from '#components'
import type { MaybeRefOrGetter } from 'vue'

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
  file: File
  maxColors?: MaybeRefOrGetter<number>
}

async function openFileProcessDialog(props: FileProcessOptions) {
  const { open } = useDialogs()
  return await open(FileProcessDialog, props)
}

export { openFileProcessDialog }
export type { FileProcessOptions }
