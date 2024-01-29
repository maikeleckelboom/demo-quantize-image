<script lang="ts" setup>
const props = defineProps<{
  source: string | string[] | number | number[]
}>()

function getSourceAsString() {
  if (!props.source) return ''
  if (typeof props.source === 'number') return props.source.toString()
  if (isArray(props.source)) {
    return props.source.map((item) => item.toString()).join('\n')
  }
  return props.source
}

const { text, copy, copied, isSupported } = useClipboard({ source: getSourceAsString })

if (import.meta.client && !isSupported.value) {
  console.warn('Clipboard API is not supported in this browser.\n', text.value)
}
</script>

<template>
  <button :data-copied="copied" class="p-1" @click="copy()">
    <Icon v-if="copied" class="w-5 h-5" name="ic:round-done" />
    <Icon v-else class="w-5 h-5 text-on-surface-variant" name="ic:round-content-copy" />
  </button>
</template>
