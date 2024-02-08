<script lang="ts" setup>
import { hexFromArgb } from '@material/material-color-utilities'
</script>

<template>
  <div class="flex flex-col items-end p-2">
    <p class="mb-1 p-1 text-body-sm italic text-on-surface-variant">Current</p>
    <div :style="{ background: hexFromArgb(initialColor) }" class="aspect-square size-14 rounded-lg" />
  </div>
</template>

<style scoped></style>
