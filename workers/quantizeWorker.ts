import { argbFromRgb, QuantizerCelebi, Score } from '@material/material-color-utilities'

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

type ProgressData = {
  type: 'progress'
  task: string
  progress: number
  step: number
}

type DoneData = {
  type: 'done'
  prominentColors: Map<number, number>
  seedColors: number[]
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

const processes = [
  'Create an image from the file',
  'Draw the image onto a canvas',
  'Get image data from the canvas',
  'Convert image data to bytes',
  'Decode bytes into pixels',
  'Quantize pixels to find prominent colors',
  'Score prominent colors to obtain seed colors'
]

function* stepsGenerator() {
  for (let i = 0; i < processes.length; i++) {
    yield processes[i]
  }
}

if (typeof self !== 'undefined') {
  addEventListener('message', async (event: MessageEvent<WorkerInitData>) => {
    const steps = stepsGenerator()
    const data = event.data

    const file = data.file

    if (!file) {
      return
    }

    const img = await createImageBitmap(file)
    postMessage({
      type: 'progress',
      message: steps.next().value,
      step: 1
    })

    const canvas = new OffscreenCanvas(img.width, img.height)
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)
    postMessage({
      type: 'progress',
      message: steps.next().value,
      step: 2
    })

    const imageData = ctx.getImageData(0, 0, img.width, img.height)
    postMessage({
      type: 'progress',
      message: steps.next().value,
      step: 3
    })

    const bytes = new Uint8ClampedArray(imageData.data.buffer)
    postMessage({
      type: 'progress',
      message: steps.next().value,
      step: 4
    })

    const pixels = pixelsFromImageBytes(bytes)
    postMessage({
      type: 'progress',
      message: steps.next().value,
      step: 5
    })

    const prominentColors = QuantizerCelebi.quantize(pixels, data.maxColors)
    postMessage({
      type: 'progress',
      message: steps.next().value,
      step: 6
    })

    postMessage({
      type: 'progress',
      message: steps.next().value,
      step: 7
    })

    const seedColors = Score.score(prominentColors)
    postMessage({
      type: 'done',
      prominentColors,
      seedColors
    })
  })
}
