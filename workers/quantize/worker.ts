import { argbFromRgb, QuantizerCelebi, Score } from '@material/material-color-utilities'
import type { QuantizeProcess, StartEventData } from './types'

function pixelsFromImageBytes(imageBytes: Uint8ClampedArray): number[] {
  const pixels: number[] = []
  const { length } = imageBytes
  for (let i = 0; i < length; i += 4) {
    const r = imageBytes[i]
    const g = imageBytes[i + 1]
    const b = imageBytes[i + 2]
    const a = imageBytes[i + 3]
    if (a < 255) continue
    const argb = argbFromRgb(r, g, b)
    pixels.push(argb)
  }
  return pixels
}

async function retrieveImageData(data: StartEventData): Promise<ImageData> {
  const img = await createImageBitmap(data.file)
  const canvas = createNewOffscreenCanvas(img)
  return imageDataFromCanvas(img, canvas)
}

function createNewOffscreenCanvas(img: ImageBitmap): OffscreenCanvas {
  return new OffscreenCanvas(img.width, img.height)
}

function imageDataFromCanvas(img: ImageBitmap, canvas: OffscreenCanvas): ImageData {
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  return ctx.getImageData(0, 0, img.width, img.height)
}

function bytesFromImageData(imageData: ImageData): Uint8ClampedArray {
  return new Uint8ClampedArray(imageData.data.buffer)
}

function quantizePixels<T>(pixels: number[], maxColors: number): T {
  return QuantizerCelebi.quantize(pixels, maxColors) as T
}

function getSuitableColors(prominentColors: Map<number, number>): Score {
  return Score.score(prominentColors)
}

const steps: QuantizeProcess<unknown>[] = [
  {
    name: 'Retrieve Image Data',
    description:
      'Obtain the raw image data, containing information about the color values of each pixel in the image.',
    fn: retrieveImageData
  },
  {
    name: 'Convert Bitmap to Byte Array',
    description:
      'Transform the image bitmap into a byte array representation, which is more suitable for processing and manipulation.',
    fn: bytesFromImageData
  },
  {
    name: 'Decode Bytes into Pixel Values',
    description:
      'Decode the byte array back into pixel values, reconstructing the image data in its original form.',
    fn: pixelsFromImageBytes
  },
  {
    name: 'Quantize Pixels to Reduce Colors',
    description:
      'Apply pixel quantization to reduce the number of distinct colors present in the image while maintaining its visual integrity.',
    fn: quantizePixels
  },
  {
    name: 'Evaluate and Score Colors',
    description:
      'Assess the quantized colors based on various criteria such as contrast, brightness, or harmony to determine their suitability for further use or display.',
    fn: getSuitableColors
  }
]

async function* quantizeProcessGenerator({ data }: MessageEvent<StartEventData>) {
  let result: any = null
  let step = 1
  for (const { name, description, fn } of steps) {
    try {
      result = await fn(result || data, data.maxColors)
      yield {
        type: step < steps.length ? 'progress' : 'done',
        step: step++,
        name,
        description,
        result
      }
    } catch (error) {
      yield { type: 'error', error }
      return
    }
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
