<script lang="ts" setup>
const { isTop } = useStack()

watch(isTop, (top) => {
  if (top) {
    console.log(`
      DialogBackdrop isTop: ${top}
    `)
  }
})
</script>

<template>
  <div class="fixed h-svh w-svw overflow-hidden bg-scrim/60">
    <slot />
  </div>
</template>

<style scoped></style>
