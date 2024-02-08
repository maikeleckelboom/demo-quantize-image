const useFilesStore = defineStore('files', () => {
  const files = ref<File[]>([])
  const { selectedFile, clearSelection, selectFile, isSelected } = useFileSelection(files)

  function reset() {
    files.value = []
    clearSelection()
  }

  return {
    files,
    reset,
    selectedFile,
    clearSelection,
    selectFile,
    isSelected
  }
})

export { useFilesStore }