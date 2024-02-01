<script lang="ts" setup>
import { hexFromArgb, type TonalPalette } from '@material/material-color-utilities'

const props = defineProps<{
  palette: TonalPalette
}>()

const { palette } = toRefs(props)

const keyColor = computed(() => {
  return palette.value.keyColor
})

const keyColorHex = computed(() => {
  if (!keyColor.value) return ''
  return hexFromArgb(keyColor.value.toInt())
})
</script>

<template>
  <div :style="{ backgroundColor: keyColorHex }" class="aspect-video size-full rounded-md">
    <slot></slot>
  </div>
</template>

<style></style>
