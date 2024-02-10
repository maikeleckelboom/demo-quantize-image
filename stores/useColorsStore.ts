const useColorsStore = defineStore('colors', () => {
  const prominentColors = ref<Map<number, number>>(new Map())
  /*  const prominentColors = computed({
      get: () => Array.from(prominentColorsMap.value.entries()).sort((a, b) => b[1] - a[1]),
      set: (colors: [number, number][]) => {
        prominentColorsMap.value = new Map(colors)
      }
    })*/
  const seedColors = ref<number[]>([])

  function setProminentColors(colors: Map<number, number>) {
    prominentColors.value = colors
  }

  function setSeedColors(colors: number[]) {
    seedColors.value = colors
  }

  return { prominentColors, seedColors, setProminentColors, setSeedColors }
})

export { useColorsStore }
