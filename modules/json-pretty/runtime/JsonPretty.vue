<script lang="ts" setup>
import VueJsonPretty from 'vue-json-pretty'
import type { JsonPrettyProps } from '~/modules/json-pretty/types'

withDefaults(defineProps<Partial<JsonPrettyProps>>(), {
  data: null,
  deep: 1,
  showLineNumbers: false,
  showDoubleQuotes: false,
  highlightSelectedNode: false,
  virtual: false
})
</script>

<template>
  <VueJsonPretty
    :data="data"
    :deep="deep"
    :highlight-selected-node="highlightSelectedNode"
    :show-double-quotes="showDoubleQuotes"
    :virtual="virtual"
    class="scrollbar"
  />
</template>

<style scoped></style>
