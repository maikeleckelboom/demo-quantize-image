<script lang="ts" setup>
const isVisible = ref<boolean>(false)
</script>

<template>
  <div>
    <Button @click="isVisible = true">Open dialog</Button>
    <DialogComponent :open="isVisible" @close="isVisible = false">
      <KeyColorModel />
      <div class="mt-6 flex justify-end gap-x-1 px-2">
        <Button intent="text" @click="isVisible = false">Close</Button>
        <Button intent="outlined"> Apply</Button>
      </div>
    </DialogComponent>
  </div>
</template>

<style scoped></style>
