<script lang="ts" setup>
const modelValue = defineModel<string | number>()
</script>

<template>
  <input
    v-model="modelValue"
    class="rounded-md bg-transparent px-3 py-2 text-on-surface-variant focus:outline-none"
    type="text"
  />
</template>

<style scoped></style>
