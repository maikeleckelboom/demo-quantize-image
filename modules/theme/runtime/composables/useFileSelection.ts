import type { MaybeRefOrGetter } from 'vue'

function useFileSelection(
  files: MaybeRefOrGetter<File[]>,
  atLeastOneSelected: MaybeRefOrGetter<boolean> = true
) {
  const filesArr = ref<File[]>([])
  const selectedFileIndex = ref<number>()

  watch(
    () => toValue(files),
    (files) => {
      filesArr.value = files
      if (toValue(atLeastOneSelected) && files.length > 0) {
        selectedFileIndex.value = 0
      }
    }
  )

  const selectedFile = computed<File | undefined>(() => {
    if (isUndefined(selectedFileIndex.value)) return
    return filesArr.value[selectedFileIndex.value]
  })

  function selectFile(index: number) {
    selectedFileIndex.value = index
  }

  function clearSelection() {
    selectedFileIndex.value = undefined
  }

  function isSelected(idx: number) {
    return selectedFileIndex.value === idx
  }

  return {
    selectedFile,
    selectFile,
    clearSelection,
    isSelected
  }
}

export { useFileSelection }
