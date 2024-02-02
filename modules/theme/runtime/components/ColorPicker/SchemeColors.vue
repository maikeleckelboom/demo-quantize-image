<script lang="ts" setup>
const dynamicSchemeColors = useSchemeColors({ brightnessSuffix: true })
</script>

<template>
  <JsonPretty :data="dynamicSchemeColors" :deep="0" />
</template>

<style scoped></style>
