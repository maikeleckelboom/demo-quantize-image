import KeyColorDialog from '~/modules/theme/runtime/components/ColorPicker/KeyColorDialog.vue'

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
