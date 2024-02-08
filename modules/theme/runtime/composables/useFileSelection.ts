import type { MaybeRefOrGetter } from 'vue'

function useFileSelection(files: MaybeRefOrGetter<File[]>) {
  const filesArr = ref<File[]>([])
  const selectedFileIndex = ref<number>()

  watch(
    () => toValue(files),
    (v) => {
      console.log('Files changed', v)
    }
  )

  const selectedFile = computed(() => {
    if (selectedFileIndex.value !== undefined) {
      return filesArr.value[selectedFileIndex.value]
    }
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
