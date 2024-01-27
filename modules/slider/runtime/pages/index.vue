<script lang="ts" setup>
import { useHctSpectra } from '~/modules/theme/runtime/composables/useHctSpectra'

const { hue: hueSpectrum, chroma: chromaSpectrum, tone: ToneSpectrum } = useHctSpectra()

const hctModel = reactive({
  hue: 120,
  chroma: 150,
  tone: 80
})
</script>

<template>
  <div class="">

  </div>
</template>

<style>

</style>
