import { argbFromRgb, QuantizerCelebi, Score } from '@material/material-color-utilities'
import type { StartEventData } from './types'

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

function createNewOffscreenCanvas(img: ImageBitmap) {
  return new OffscreenCanvas(img.width, img.height)
}

function imageDataFromCanvas(img: ImageBitmap, canvas: OffscreenCanvas) {
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  return ctx.getImageData(0, 0, img.width, img.height)
}

function bytesFromImageData(imageData: ImageData) {
  return new Uint8ClampedArray(imageData.data.buffer)
}

function quantizePixels(pixels: number[], maxColors: number) {
  return QuantizerCelebi.quantize(pixels, maxColors)
}

function getSuitableColors(prominentColors: Map<number, number>) {
  return Score.score(prominentColors)
}

const steps: string[] = [
  'Create Offscreen Canvas',
  'Draw Image onto Canvas',
  'Get Image Data from Canvas',
  'Convert Image Data to Bytes',
  'Decode Bytes to Pixels',
  'Quantize Pixels to find Prominent Colors',
  'Score Colors to find Suitable Colors'
] as const

async function* quantizeProcessGenerator({ data }: MessageEvent<StartEventData>) {
  let step: number = 0
  try {
    const img = await createImageBitmap(data.file)
    yield { type: 'progress', description: steps[step], step: ++step }
    const canvas = createNewOffscreenCanvas(img)
    yield { type: 'progress', description: steps[step], step: ++step }
    const imageData = imageDataFromCanvas(img, canvas)
    yield { type: 'progress', description: steps[step], step: ++step }
    const bytes = bytesFromImageData(imageData)
    yield { type: 'progress', description: steps[step], step: ++step }
    const pixels = pixelsFromImageBytes(bytes)
    yield { type: 'progress', description: steps[step], step: ++step }
    const prominentColors = quantizePixels(pixels, data.maxColors)
    yield { type: 'progress', description: steps[step], step: ++step }
    const suitableColors = getSuitableColors(prominentColors)
    yield { type: 'progress', description: steps[step], step: ++step }
    yield { type: 'done', prominentColors, suitableColors }
  } catch (error) {
    yield { type: 'error', error }
  }
}

if (typeof self !== 'undefined') {
  self.onmessage = async (event: MessageEvent<StartEventData>) => {
    const processGenerator = quantizeProcessGenerator(event)
    for await (const message of processGenerator) {
      postMessage(message)
    }
  }
}

export {
  steps,
  pixelsFromImageBytes,
  createNewOffscreenCanvas,
  imageDataFromCanvas,
  bytesFromImageData,
  quantizePixels,
  getSuitableColors
}
