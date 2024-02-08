const useColorsStore = defineStore('colors', () => {
  const prominentColorsMap = ref<Map<number, number>>(new Map())
  const prominentColors = computed({
    get: () => Array.from(prominentColorsMap.value.entries()).sort((a, b) => b[1] - a[1]),
    set: (colors: [number, number][]) => {
      prominentColorsMap.value = new Map(colors)
    }
  })
  const seedColors = ref<number[]>([])

  return { prominentColors, seedColors }
})

export { useFilesStore }
