import { argbFromRgb, QuantizerCelebi, Score } from '@material/material-color-utilities'

type Data = {
  file: File
  maxColors: number
}

const processes = [
  'Create an image from the file',
  'Draw the image onto a canvas',
  'Get image data from the canvas',
  'Convert image data to bytes',
  'Decode bytes into pixels',
  'Quantize pixels to find prominent colors',
  'Score prominent colors to obtain seed colors'
]

const getProgress = (value: number, i: number) => {
  return {
    type: 'progress',
    value,
    task: processes[i]
  }
}

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

onmessage = async (event: MessageEvent) => {
  const data: Data = event.data
  // 1. Create an image from the file
  const img = await createImageBitmap(data.file)
  // 2. Draw the image onto a canvas
  const canvas = new OffscreenCanvas(img.width, img.height)
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  // 3. Get image data from the canvas
  const imageData = ctx.getImageData(0, 0, img.width, img.height)
  // 4. Convert image data to bytes
  const bytes = new Uint8ClampedArray(imageData.data.buffer)
  // 5. Decode bytes into pixels
  const pixels = pixelsFromImageBytes(bytes)
  // 6. Quantize pixels to find prominent colors
  const prominentColors = QuantizerCelebi.quantize(pixels, data.maxColors)
  // 7. Score prominent colors to obtain seed colors
  const seedColors = Score.score(prominentColors)
  postMessage({ type: 'done', seedColors })
}
