<script lang="ts" setup>
import type { DialogComponent } from '#components'

const { close } = useDialogs()
const { isTop } = useStack()

function exit() {
  if (!isTop.value) return
  close(null)
}
</script>

<template>
  <DialogBackdrop>
    <DialogComponent ref="root" @close="exit">
      <template #header>
        <h1 class="text-headline-sm font-medium capitalize md:text-headline-md"></h1>
      </template>
      <template #default> Ello </template>
      <template #footer></template>
    </DialogComponent>
  </DialogBackdrop>
</template>

<style scoped></style>
