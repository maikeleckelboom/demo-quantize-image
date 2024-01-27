<script lang="ts" setup>
defineSlots<{
  preview(): void
  controls(): void
  default(): void
}>()
</script>

<template>
  <div class="grid grid-cols-[1fr,auto] grid-rows-[auto,1fr,auto]">
    <div class="col-span-full size-full">
      <slot name="preview" />
    </div>
    <div class="size-full">
      <slot />
    </div>
    <div class="size-full">
      <slot name="controls" />
    </div>
  </div>
</template>

<style scoped>

</style>
