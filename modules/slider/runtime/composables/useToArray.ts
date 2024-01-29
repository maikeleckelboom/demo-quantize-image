import type { Ref } from 'vue'
import { isArray } from '@vue/shared'

function useToArray<T extends number>(modelValue: Ref<T | T[]>, initial: T) {
  return computed({
    get: () =>
      isArray(modelValue.value)
        ? modelValue.value
        : ([modelValue.value ?? initial] as T[]),
    set: (value: T | T[]) => {
      modelValue.value = isArray(value) ? value : [value]
    }
  })
}

export { useToArray }
