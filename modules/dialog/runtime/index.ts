import type { DialogProps } from '~/modules/dialog/types'

type PasswordDialogProps = {
  inputLabel: string
  confirmLabel: string
} & Partial<DialogProps>

export { type PasswordDialogProps }
