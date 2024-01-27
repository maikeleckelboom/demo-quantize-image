<script lang="ts" setup>

</script>

<template>
  <div class="p-4 flex justify-center items-center flex-col gap-2">
    <KeyColorPickers />
  </div>
</template>

<style lang="postcss">
.outlined-button {
  @apply relative size-fit overflow-clip rounded-3xl px-6 py-3 bg-transparent border border-primary;
  @apply leading-none text-center text-label-lg font-medium;
  @apply after:absolute after:bg-transparent after:inset-0 after:z-0;
  @apply hover:after:bg-surface-level-1 focus-visible:after:bg-surface-level-3 active:after:bg-surface-level-2;
}
</style>
