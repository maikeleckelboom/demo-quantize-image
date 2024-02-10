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

type WorkerStartData = {
  type: 'start'
  maxColors: number
  file: File
}

type ProgressData = {
  type: 'progress'
  step: number
  description: string
}

type DoneData = {
  type: 'done'
  prominentColors: Map<number, number>
  seedColors: number[]
}

type WorkerData = ProgressData | DoneData | WorkerStartData

interface QuantizeWorker extends Omit<Worker, 'postMessage'> {
  postMessage(data: WorkerStartData): void
}

export type { QuantizeWorker, WorkerData, WorkerStartData, ProgressData, DoneData }

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
  'Score colors to find suitable colors'
] as const

export type Process = (typeof processes)[number]
export { processes }

function* stepsGenerator() {
  for (let i = 0; i < processes.length; i++) {
    yield processes[i]
  }
}

async function* postMessageGenerator() {}

function createNewOffscreenCanvas(img: ImageBitmap) {
  return new OffscreenCanvas(img.width, img.height)
}

function drawImageOntoCanvas(img: ImageBitmap, canvas: OffscreenCanvas) {
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)
}

function getImageDataFromCanvas(canvas: OffscreenCanvas) {
  return canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height)
}

function getBytesFromImageData(imageData: ImageData) {
  return new Uint8ClampedArray(imageData.data.buffer)
}

async function* quantizeProcessGenerator(event: MessageEvent<WorkerStartData>) {
  const { file, maxColors } = event.data
  const img = await createImageBitmap(file)
  const canvas = new OffscreenCanvas(img.width, img.height)
  yield img

  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  const imageData = ctx.getImageData(0, 0, img.width, img.height)
  yield imageData

  const bytes = new Uint8ClampedArray(imageData.data.buffer)
  yield bytes

  const pixels = pixelsFromImageBytes(bytes)
  yield pixels

  const prominentColors = QuantizerCelebi.quantize(pixels, maxColors)
  yield prominentColors

  const seedColors = Score.score(prominentColors)
  yield seedColors

  yield {
    type: 'done',
    prominentColors,
    seedColors
  }
}

/*
const { file, maxColors } = event.data
const img = await createImageBitmap(file)
const canvas = new OffscreenCanvas(img.width, img.height)
const ctx = canvas.getContext('2d')!
ctx.drawImage(img, 0, 0)
const imageData = ctx.getImageData(0, 0, img.width, img.height)
const bytes = new Uint8ClampedArray(imageData.data.buffer)
const pixels = pixelsFromImageBytes(bytes)
const prominentColors = QuantizerCelebi.quantize(pixels, maxColors)
const seedColors = Score.score(prominentColors)
*/

if (typeof self !== 'undefined') {
  self.addEventListener('message', async (event: MessageEvent<WorkerStartData>) => {
    const { file, maxColors } = event.data

    if (!file) {
      // console.error('No file provided, cannot quantize image.')
      return
    }

    const steps = stepsGenerator()
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

    const prominentColors = QuantizerCelebi.quantize(pixels, maxColors)
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
