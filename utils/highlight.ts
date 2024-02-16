import highlight from 'highlight.js'

const highlightedCode = (code: string) => highlight.highlightAuto(code, ['typescript'])?.value ?? ''

export { highlightedCode }
