import { argbFromRgb, QuantizerCelebi, Score } from '@material/material-color-utilities'
import type { StartEventData } from '../types'

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

async function retrieveImageData(data: StartEventData) {
  const img = await createImageBitmap(data.file)
  const canvas = createNewOffscreenCanvas(img)
  return imageDataFromCanvas(img, canvas)
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

type Process = {
  index: number
  name: string
  description: string
}

type QuantizeFn =
  | typeof retrieveImageData
  | typeof bytesFromImageData
  | typeof pixelsFromImageBytes
  | typeof quantizePixels
  | typeof getSuitableColors

type QuantizeProcess = {
  name: string
  description: string
  fn: QuantizeFn
  params: string[]
}

const steps: QuantizeProcess[] = [
  {
    name: 'Retrieve Image Data',
    description:
      'Obtain the raw image data, containing information about the color values of each pixel in the image.',
    fn: retrieveImageData,
    params: ['data']
  },
  {
    name: 'Convert Bitmap to Byte Array',
    description:
      'Transform the image bitmap into a byte array representation, which is more suitable for processing and manipulation.',
    fn: bytesFromImageData,
    params: ['imageData']
  },
  {
    name: 'Decode Bytes into Pixel Values',
    description:
      'Decode the byte array back into pixel values, reconstructing the image data in its original form.',
    fn: pixelsFromImageBytes,
    params: ['imageBytes']
  },
  {
    name: 'Quantize Pixels to Reduce Colors',
    description:
      'Apply pixel quantization to reduce the number of distinct colors present in the image while maintaining its visual integrity.',
    fn: quantizePixels,
    params: ['pixels', 'maxColors']
  },
  {
    name: 'Evaluate and Score Colors',
    description:
      'Assess the quantized colors based on various criteria such as contrast, brightness, or harmony to determine their suitability for further use or display.',
    fn: getSuitableColors,
    params: ['prominentColors']
  }
]

async function* quantizeProcessGenerator({ data }: MessageEvent<StartEventData>) {}

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
