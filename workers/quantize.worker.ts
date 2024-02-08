import { argbFromRgb, QuantizerCelebi, Score } from '@material/material-color-utilities'

type MessageType = 'done' | 'progress'

const processes = [
  'Create an image from the file',
  'Draw the image onto a canvas',
  'Get image data from the canvas',
  'Convert image data to bytes',
  'Decode bytes into pixels',
  'Quantize pixels to find prominent colors',
  'Score prominent colors to obtain seed colors'
]

function pixelsFromImageBytes(imageBytes: Uint8ClampedArray) {
  const pixels: number[] = []
  for (let i = 0; i < imageBytes.length; i += 4) {
    const r = imageBytes[i]
    const g = imageBytes[i + 1]
    const b = imageBytes[i + 2]
    const a = imageBytes[i + 3]
    if (a < 255) {
      continue
    }
    const argb = argbFromRgb(r, g, b)
    pixels.push(argb)
  }
  return pixels
}

const numOfSteps = processes.length

function* stepsGenerator() {
  for (let i = 0; i < processes.length; i++) {
    yield processes[i]
  }
}

type ProgressData = {
  type: 'progress'
  task: string
  progress: number
  step: number
}

type DoneData = {
  type: 'done'
  colors: {
    prominent: Map<number, number>
    seed: number[]
  }
}

type WorkerInitData = {
  type: 'init'
  maxColors: number
  file: File
}

type WorkerData = ProgressData | DoneData | WorkerInitData

interface QuantizeWorker extends Omit<Worker, 'postMessage'> {
  postMessage(data: WorkerInitData): void
}

export type { QuantizeWorker, WorkerData, WorkerInitData, ProgressData, DoneData }

function isProgressData(data: WorkerData): data is ProgressData {
  return data.type === 'progress'
}

function isDoneData(data: WorkerData): data is DoneData {
  return data.type === 'done'
}

export { isProgressData, isDoneData }

/*
interface QuantizeWorker extends Omit<Worker, 'postMessage'> {
  postMessage(data: WorkerData): void
}*/

addEventListener('message', async (event: MessageEvent<WorkerInitData>) => {
  const steps = stepsGenerator()
  const data = event.data
  // 1. Create an image from the file
  const img = await createImageBitmap(data.file)
  postMessage({
    type: 'progress',
    message: steps.next().value,
    step: 1
  })
  // 2. Draw the image onto a canvas
  const canvas = new OffscreenCanvas(img.width, img.height)
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  postMessage({
    type: 'progress',
    message: steps.next().value,
    step: 2
  })
  // 3. Get image data from the canvas
  const imageData = ctx.getImageData(0, 0, img.width, img.height)
  postMessage({
    type: 'progress',
    message: steps.next().value,
    step: 3
  })
  // 4. Convert image data to bytes
  const bytes = new Uint8ClampedArray(imageData.data.buffer)
  postMessage({
    type: 'progress',
    message: steps.next().value,
    step: 4
  })
  // 5. Decode bytes into pixels
  const pixels = pixelsFromImageBytes(bytes)
  postMessage({
    type: 'progress',
    message: steps.next().value,
    step: 5
  })
  // 6. Quantize pixels to find prominent colors
  const prominent = QuantizerCelebi.quantize(pixels, data.maxColors)
  postMessage({
    type: 'progress',
    message: steps.next().value,
    step: 6
  })
  // 7. Score prominent colors to obtain seed colors
  postMessage({
    type: 'progress',
    message: steps.next().value,
    step: 7
  })
  const seed = Score.score(prominent)
  postMessage({
    type: 'done',
    colors: {
      prominent,
      seed
    }
  })
})
