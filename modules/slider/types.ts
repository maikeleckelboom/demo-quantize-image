interface SliderProps {
  modelValue?: number | number[]
  min?: string | number
  max?: string | number
  step?: number | 'any' | (string & {})
  marks?: Marks

  decimals?: number

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
  lazy?: false,
  contained?: boolean | 'true' | 'false'
  trackStyle?: Record<string, any>
}

export type { SliderProps }

type MarkObject = Record<string, string>
type MarkObjectArray = Array<MarkObject>
type MarkNumberArray = Array<number>
type MarkStringArray = Array<string>
type MarkFunction = (value: number) => MarkObject | number | string

type Marks = MarkObject | MarkObjectArray | MarkNumberArray | MarkStringArray | MarkFunction

export type { Marks, MarkObject, MarkObjectArray, MarkNumberArray, MarkStringArray, MarkFunction }

const exampleMarkFn = (value: number) => {
  return value % 20 === 0
}

// ___ All input types ___ //

/* object */
const examplePlainObject: MarkObject = {
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

