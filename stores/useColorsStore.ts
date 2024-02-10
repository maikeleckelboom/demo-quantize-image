const useColorsStore = defineStore('colors', () => {
  const prominentColors = ref<Map<number, number>>()

  const seedColors = ref<number[]>()

  function setProminentColors(colors: Map<number, number>) {
    prominentColors.value = colors
  }

  function setSeedColors(colors: number[]) {
    seedColors.value = colors
  }

  function reset() {
    prominentColors.value = undefined
    seedColors.value = undefined
  }

  return { prominentColors, seedColors, setProminentColors, setSeedColors, reset }
})

export { useColorsStore }
