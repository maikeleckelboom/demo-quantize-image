<script lang="ts" setup>
const props = defineProps<{
  source: string | string[]
}>()

function getSourceAsString() {
  return isArray(props.source) ? props.source.join('\n') : props.source
}

const { text, copy, copied, isSupported } = useClipboard({ source: getSourceAsString })

if (!isSupported.value) {
  console.warn('Clipboard API is not supported in this browser')
}
</script>

<template>
  <button class="p-1" @click="copy()">
    <Icon v-if="copied" class="w-5 h-5" name="ic:round-done" />
    <Icon v-else class="w-5 h-5 text-on-surface-variant" name="ic:round-content-copy" />
  </button>
</template>
