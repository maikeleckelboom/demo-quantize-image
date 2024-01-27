type MarkObject = Record<string, string>
type MarkObjectArray = Array<MarkObject> // [{ value: 1, label: '1' }]
type MarkNumberArray = Array<number> // [1, 2, 3]
type MarkStringArray = Array<string> // ['1', '2', '3']
type MarkFunction = (value: number) => MarkObject | number | string // (value) => ({ value, label: value })
type Marks = MarkObject | MarkObjectArray | MarkNumberArray | MarkStringArray | MarkFunction // [{ value: 1, label: '1' }]


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
    '7': 'G',
}

/* string[] */
const exampleAbcArray: MarkStringArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

/* number[] */
const example123Array: MarkNumberArray = [1, 2, 3, 4, 5, 6, 7]


interface SliderProps {
    modelValue?: number | number[]
    min?: string | number
    max?: string | number
    step?: number | 'any' | (string & {})
    marks?: Marks


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
    contained?: boolean|'true'|'false'
    trackStyle?: Record<string, any>
}

export type {
    SliderProps
}
