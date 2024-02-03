<script lang="ts" setup>
const isVisible = ref<boolean>(false)

const { sourceColor } = useThemeConfig()
</script>

<template>
  <div>
    <Button @click="isVisible = true">Open dialog</Button>
    <DialogComponent :open="isVisible" @close="isVisible = false">
      <div class="grid gap-4 md:grid-cols-2">
        <KeyColorModel />

        <ColorFetchColorData :color="sourceColor" />
      </div>
      <div class="mt-6 flex justify-end gap-x-1 px-2">
        <Button intent="text" @click="isVisible = false">Close</Button>
      </div>
    </DialogComponent>
  </div>
</template>

<style scoped></style>
