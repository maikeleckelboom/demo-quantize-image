import { Score } from '@material/material-color-utilities'

type QuantizeWorker = Omit<Worker, 'postMessage'> & {
  postMessage(data: StartEventData): void
}

type QuantizeFn<T> =
  | ((data: StartEventData) => Promise<ImageData>)
  | ((imageData: ImageData) => Uint8ClampedArray)
  | ((imageBytes: Uint8ClampedArray) => number[])
  | ((pixels: number[], maxColors: number) => T)
  | ((prominentColors: Map<number, number>) => Score)

type QuantizeProcess<T> = {
  name: string
  description: string
  fn: QuantizeFn<T>
}

type StartEventData = {
  type: 'start'
  file: File
  maxColors: number
}

type ProgressEventData = {
  type: 'progress'
  step: number
  name: string
  description: string
  result: ReturnType<QuantizeFn<unknown>>
}

type ErrorEventData = {
  type: 'error'
  error: Error
}

type DoneEventData = {
  type: 'done'
  prominentColors: Map<number, number>
  suitableColors: number[]
}

type WorkerEventData = ProgressEventData | DoneEventData | ErrorEventData

export type {
  QuantizeWorker,
  WorkerEventData,
  StartEventData,
  ProgressEventData,
  DoneEventData,
  ErrorEventData,
  QuantizeFn,
  QuantizeProcess
}

function isProgressEvent(
  event: MessageEvent<WorkerEventData>
): event is MessageEvent<ProgressEventData> {
  return event.data.type === 'progress'
}

function isDoneEvent(event: MessageEvent<WorkerEventData>): event is MessageEvent<DoneEventData> {
  return event.data.type === 'done'
}

function isErrorEvent(event: MessageEvent<WorkerEventData>): event is MessageEvent<ErrorEventData> {
  return event.data.type === 'error'
}

export { isProgressEvent, isDoneEvent, isErrorEvent }
