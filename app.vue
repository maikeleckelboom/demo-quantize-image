<script lang="ts" setup>
function onError(error: unknown) {
  console.error(error)
}
</script>
<template>
  <NuxtErrorBoundary @error="onError">
    <NuxtLayout>
      <NuxtLoadingIndicator :color="repeatingLinearGradient" />
      <NuxtPage />
    </NuxtLayout>
  </NuxtErrorBoundary>
</template>
