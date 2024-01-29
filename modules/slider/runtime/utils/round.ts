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

/**
 * Round value to given decimals
 * @param value
 * @param decimals
 */
function roundNumber(value: number, decimals: number = 0) {
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals)
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
