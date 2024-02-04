<script lang="ts" setup>
const isVisible = ref<boolean>(true)

const { sourceColor } = useThemeConfig()
</script>

<template>
  <div>
    <Button @click="isVisible = true">Open dialog</Button>
    <DialogComponent :open="isVisible" @close="isVisible = false">
      <KeyColorModel />
    </DialogComponent>
  </div>
</template>

<style scoped></style>
