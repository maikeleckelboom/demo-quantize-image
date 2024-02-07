<script lang="ts" setup>
import { hexFromArgb } from '@material/material-color-utilities'

defineProps<{
  color: number
}>()
</script>

<template>
  <div :style="{ background: hexFromArgb(color) }" class="relative aspect-video max-h-28 rounded-md">
    <slot />
  </div>
</template>

<style></style>
