<script lang="ts" setup>
function onFabClick() {}
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-[92px]">
    <div class="mx-auto flex size-full max-w-xl justify-end px-4">
      <Button
        class="pointer-events-auto"
        intent="extended-fab"
        size="md"
        variant="primary"
        @click="onFabClick"
      >
        <Icon name="ic:round-add" />
      </Button>
    </div>
  </div>
</template>
