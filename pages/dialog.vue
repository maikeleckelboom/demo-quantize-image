<script lang="ts" setup>
const isVisible = ref<boolean>(true)

const { sourceColor } = useThemeConfig()
</script>

<template>
  <div>
    <Button @click="isVisible = true">Open dialog</Button>
    <DialogComponent :open="isVisible" @close="isVisible = false">
      <div class="grid gap-4">
        <KeyColorModel />
      </div>
      <template #footer>
        <Buttons>
          <Button intent="outlined">
            <icon name="ic:round-arrow-right-alt" />
            Cancel
          </Button>
        </Buttons>
      </template>
    </DialogComponent>
  </div>
</template>

<style scoped></style>
