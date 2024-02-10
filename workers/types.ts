type StartEventData = {
  type: 'start'
  file: File
  maxColors: number
}

type ProgressEventData = {
  type: 'progress'
  step: number
  description: string
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

type WorkerEventData = StartEventData | ProgressEventData | DoneEventData | ErrorEventData

export type {
  QuantizeWorker,
  WorkerEventData,
  StartEventData,
  ProgressEventData,
  DoneEventData,
  ErrorEventData
}

interface QuantizeWorker extends Omit<Worker, 'postMessage'> {
  postMessage(data: StartEventData): void
}

function isProgressData(data: WorkerEventData): data is ProgressEventData {
  return data.type === 'progress'
}

function isDoneData(data: WorkerEventData): data is DoneEventData {
  return data.type === 'done'
}

function isErrorData(data: WorkerEventData): data is ErrorEventData {
  return data.type === 'error'
}

export { isProgressData, isDoneData, isErrorData }
