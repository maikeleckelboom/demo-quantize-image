const useDialogs = () => {
  const { $dialogs, $openDialog, $closeDialog } = useNuxtApp()
  return {
    dialogs: $dialogs,
    open: $openDialog,
    close: $closeDialog
  }
}

export { useDialogs }
