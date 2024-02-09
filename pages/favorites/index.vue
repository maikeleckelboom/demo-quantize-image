<script lang="ts" setup></script>

<template>
  <div class="mx-auto w-full max-w-xl p-4">
    <div class="box-target h-[400px] w-[200px] bg-error p-4"></div>

    <NuxtLink to="/favorites/1">Go to favorite 1</NuxtLink>
  </div>
</template>

<style>
.box-target {
  view-transition-name: target;
}
</style>
