interface SliderProps {
  modelValue?: number | number[]
  min?: string | number
  max?: string | number
  step?: number | 'any' | (string & {})
  marks?: Marks

  decimals?: string | number
  round?: number | boolean | 'true' | 'false' | (string & {})

  orientation?: 'horizontal' | 'vertical'
  dir?: 'ltr' | 'rtl'
  btt?: boolean
  disabled?: boolean
  preventOverlap?: boolean
  minDistance?: number
  labelVisibility?: 'auto' | 'hover' | 'focus' | 'always' | 'never'
  glide?: boolean
  interval?: number
  labelFormat?: (value: number, rounded?: number) => number | string
  lazy?: false
  contained?: boolean | 'true' | 'false'
  trackStyle?: Record<string, any>

  snapping?: boolean | 'true' | 'false'
  snapValues?: number[]
}

export type { SliderProps }

type MarksObject = Record<string | number, string>
type MarkObjectArray = MarksObject[]
type MarkNumberArray = number[]
type MarkStringArray = string[]
type MarkFunction = (value: number) => MarksObject | number | string

type Marks =
  | MarksObject
  | MarkObjectArray
  | MarkNumberArray
  | MarkStringArray
  | MarkFunction

function isMarkObject(marks: Marks | undefined): marks is MarksObject {
  return typeof marks === 'object' && !Array.isArray(marks)
}

function isMarkObjectArray(marks: Marks): marks is MarkObjectArray {
  return Array.isArray(marks) && marks.every((item) => typeof item === 'object')
}

function isMarkNumberArray(marks: Marks): marks is MarkNumberArray {
  return Array.isArray(marks) && marks.every((item) => typeof item === 'number')
}

function isMarkStringArray(marks: Marks): marks is MarkStringArray {
  return Array.isArray(marks) && marks.every((item) => typeof item === 'string')
}

function isMarkFunction(marks: Marks): marks is MarkFunction {
  return typeof marks === 'function'
}

function isMarkArray(
  marks: Marks
): marks is MarkObjectArray | MarkNumberArray | MarkStringArray {
  return isMarkObjectArray(marks) || isMarkNumberArray(marks) || isMarkStringArray(marks)
}

export type {
  Marks,
  MarksObject,
  MarkObjectArray,
  MarkNumberArray,
  MarkStringArray,
  MarkFunction
}
export {
  isMarkObject,
  isMarkObjectArray,
  isMarkNumberArray,
  isMarkStringArray,
  isMarkArray,
  isMarkFunction
}

const exampleMarkFn = (value: number) => {
  return value % 20 === 0
}

// ___ All input types ___ //

/* object */
const examplePlainObject: MarksObject = {
  '1': 'A',
  '2': 'B',
  '3': 'C',
  '4': 'D',
  '5': 'E',
  '6': 'F',
  '7': 'G'
}

/* string[] */
const exampleAbcArray: MarkStringArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

/* number[] */
const example123Array: MarkNumberArray = [1, 2, 3, 4, 5, 6, 7]
