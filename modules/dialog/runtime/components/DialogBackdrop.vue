<script setup lang="ts">
const opacity = ref<number>(0.4)
const backgroundColor = computed(() => `rgba(0, 0, 0, ${opacity.value})`)
</script>

<template>
  <div
    :style="{ backgroundColor }"
    class="fixed inset-0 z-40 h-screen w-screen overflow-hidden supports-[height:100svh]:h-[100svh] supports-[width:100svh]:w-[100svw]"
  >
    <slot />
  </div>
</template>

<style scoped></style>
