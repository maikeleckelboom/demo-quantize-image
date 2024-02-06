import { TextDialog } from '#components'
import ColorPickerDialog from '~/modules/dialog/runtime/components/ColorPickerDialog.vue'

async function promptText(title: string, text?: string) {
  const { open } = useDialogs()
  return await open(TextDialog, { title, text })
}

interface ColorPickerOptions {
  keyColor: string
  initialColor: number
  onColorChange: (color: number) => void
}

async function openColorPicker({
  keyColor,
  initialColor,
  onColorChange
}: ColorPickerOptions) {
  const { open } = useDialogs()
  return await open(ColorPickerDialog, { keyColor, initialColor, onColorChange })
}

export { promptText, openColorPicker }
export type { ColorPickerOptions }
