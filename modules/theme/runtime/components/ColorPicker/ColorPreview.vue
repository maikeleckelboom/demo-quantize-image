<script lang="ts" setup>
import { hexFromArgb } from '@material/material-color-utilities'

defineProps<{
  color: number
}>()
</script>

<template>
  <div :style="{ background: hexFromArgb(color) }" class="relative size-full rounded-md">
    <slot />
  </div>
</template>

<style></style>
