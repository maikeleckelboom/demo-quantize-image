<script lang="ts" setup></script>

<template>
  <div class="mx-auto w-full max-w-xl p-4">
    <div class="box-target h-[200px] w-[400px] bg-error-container p-4"></div>
    <NuxtLink to="/favorites">Go back to favorites</NuxtLink>
  </div>
</template>

<style scoped>
.box-target {
  view-transition-name: target;
}
</style>
