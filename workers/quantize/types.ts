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

type WorkerEventData = ProgressEventData | DoneEventData | ErrorEventData

interface QuantizeWorker extends Omit<Worker, 'postMessage'> {
  postMessage(data: StartEventData): void
}

export type {
  QuantizeWorker,
  WorkerEventData,
  StartEventData,
  ProgressEventData,
  DoneEventData,
  ErrorEventData
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
