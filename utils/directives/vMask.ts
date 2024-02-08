const vMask = (el: HTMLInputElement, binding: { value: { min: number; max: number } }) => {
  const { value } = binding
  el.addEventListener('input', () => {
    const v = parseInt((el as HTMLInputElement).value, 10)
    if (Number.isNaN(v)) {
      el.value = value.min.toString()
      return
    }
    if (v < value.min) {
      el.value = value.min.toString()
    } else if (v > value.max) {
      el.value = value.max.toString()
    }
  })
}

export { vMask }
