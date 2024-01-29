/**
 * Get precision of step
 * @param step
 */
function getPrecision(step: number) {
  const stepString = step.toString()
  if (stepString.indexOf('.') >= 0) {
    return stepString.length - stepString.indexOf('.') - 1
  }
  return 0
}

function roundNumber(num: number, decimalPlaces: number = 0) {
  const factorOfTen = Math.pow(10, decimalPlaces)
  return Math.round(num * factorOfTen) / factorOfTen
}

/**
 * Round value to given step
 * @param value
 * @param step
 */
function roundValueToStep(value: number, step: number) {
  const nearest = Math.round(value / step) * step
  return roundNumber(nearest, getPrecision(step))
}

/**
 * Get the closest step to value
 * @param value
 * @param step
 * @param min
 */
function getClosestStep(value: number, step: number, min: number) {
  const maxSteps = Math.floor((value - min) / step)
  return step * maxSteps + min
}

/**
 * Get closest value to value
 * @param value
 * @param step
 * @param min
 * @param max
 */
function getClosestValue(value: number, step: number, min: number, max: number) {
  if (value <= min) return min
  if (value >= max) return max
  if (step) {
    return getClosestStep(value, step, min)
  }
  return value
}

export {
  getPrecision,
  roundNumber,
  roundValueToStep,
  getClosestStep,
  getClosestValue
}
