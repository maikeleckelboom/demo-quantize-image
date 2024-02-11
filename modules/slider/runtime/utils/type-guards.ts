export function isNumber(v: unknown): v is number {
  return typeof v === 'number' && !isNaN(v)
}

export function isString(v: unknown): v is string {
  return typeof v === 'string'
}

export function isBoolean(v: unknown): v is boolean {
  return typeof v === 'boolean' || v instanceof Boolean
}

export function isFuzzyNumber(v: unknown): v is number {
  return isNumber(v) || v === 'auto'
}

export function isFuzzyBoolean(v: unknown): v is boolean {
  return isBoolean(v) || v === 'true' || v === 'false' || v === 'never' || v === 'always'
}

export function isObject(v: unknown): v is object {
  return v !== null && typeof v === 'object'
}

export function isArray<T = any>(v: unknown): v is Array<T> {
  return Array.isArray(v)
}

export function isFunction(v: unknown): v is Function {
  return typeof v === 'function'
}

export function isUndefined(v: unknown): v is undefined {
  return typeof v === 'undefined'
}

export function isNull(v: unknown): v is null {
  return v === null
}

export function isNil(v: unknown): v is null | undefined {
  return isUndefined(v) || isNull(v)
}

export function isTruthy(v: unknown): boolean {
  return [true, 'true', 1, '1', 'yes', 'y', 'always'].includes(v as any)
}

export function isFalsy(v: unknown): boolean {
  return [false, 'false', 0, '0', 'no', 'n', 'never'].includes(v as any)
}
