<script lang="ts" setup>
const modelValue = defineModel<string | number>()
</script>

<template>
  <input
    v-model="modelValue"
    class="rounded-md bg-transparent px-3 py-2 text-on-surface-variant hover:bg-surface-container-high focus:bg-surface-container focus:outline-1 focus-visible:outline focus-visible:outline-inverse-primary active:bg-surface-container"
    type="text"
  />
</template>

<style scoped></style>
