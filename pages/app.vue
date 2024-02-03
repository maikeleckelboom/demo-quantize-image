<script lang="ts" setup>
const { contrastLevel } = useThemeConfig()
</script>

<template>
  <div class="mx-auto h-svh w-full max-w-2xl p-4">
    <ContrastSlider v-model.number="contrastLevel" max="1" min="0" step="0.1" />
  </div>
</template>

<style scoped></style>
