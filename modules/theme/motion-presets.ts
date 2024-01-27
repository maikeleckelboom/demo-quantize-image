type EasingPreset = {
  duration: number
  action: string
  timing: string
}

const easings: Record<string, EasingPreset> = {
  emphasized: {
    duration: 500,
    action: 'Begin and end on screen',
    timing: 'Emphasized'
  },
  emphasizedDecelerate: {
    duration: 400,
    action: 'Enter the screen',
    timing: 'Emphasized decelerate'
  },
  emphasizedAccelerate: {
    duration: 200,
    action: 'Exit the screen',
    timing: 'Emphasized accelerate'
  },
  standard: {
    duration: 300,
    action: 'Begin and end on screen',
    timing: 'Standard'
  },
  standardDecelerate: {
    duration: 250,
    action: 'Enter the screen',
    timing: 'Standard decelerate'
  },
  standardAccelerate: {
    duration: 200,
    action: 'Exit the screen',
    timing: 'Standard accelerate'
  }
} as const

type CubicBezierValues = {
  x0: number
  y0: number
  x1: number
  y1: number
}

const timingFunctions: Record<keyof typeof easings, CubicBezierValues> = {
  standard: {
    x0: 0.2,
    y0: 0,
    x1: 0,
    y1: 1
  },
  standardAccelerate: {
    x0: 0.3,
    y0: 0,
    x1: 1,
    y1: 1
  },
  standardDecelerate: {
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 1
  },
  emphasizedAccelerate: {
    x0: 0.3,
    y0: 0,
    x1: 0.8,
    y1: 0.15
  },
  emphasizedDecelerate: {
    x0: 0.05,
    y0: 0.7,
    x1: 0.1,
    y1: 1
  },
  legacy: {
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 1
  },
  legacyAccelerate: {
    x0: 0.4,
    y0: 0,
    x1: 1,
    y1: 1
  },
  legacyDecelerate: {
    x0: 0,
    y0: 0,
    x1: 0.2,
    y1: 1
  },
  linear: {
    x0: 0,
    y0: 0,
    x1: 1,
    y1: 1
  }
} as const

export { easings, timingFunctions, type EasingPreset, type CubicBezierValues }
