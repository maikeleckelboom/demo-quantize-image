<script setup lang="ts">
import VueJsonPretty from 'vue-json-pretty'
import type { JSONDataType } from 'vue-json-pretty/types/utils'

defineProps<{
  data: any | JSONDataType
}>()
</script>

<template>
  <VueJsonPretty
    :highlight-selected-node="false"
    :data="data"
    :show-line-number="false"
    :show-double-quotes="false"
    :deep="1"
    class="scrollbar"
  />
</template>

<style scoped></style>
