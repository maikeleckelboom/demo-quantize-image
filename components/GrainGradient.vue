<script lang="ts" setup></script>

<template>
  <svg height="0" width="0">
    <filter id="grainy" height="100%" width="100%" x="0" y="0">
      <feTurbulence baseFrequency=".537" type="fractalNoise"></feTurbulence>
      <feColorMatrix type="saturate" values="0"></feColorMatrix>
      <feBlend in="SourceGraphic" in2="" mode="multiply"></feBlend>
    </filter>
  </svg>
  <div class="size-full"></div>
</template>

<style scoped>
div {
  background: radial-gradient(circle, rgb(var(--primary-rgb)), rgb(var(--inverse-primary-rgb)));
  filter: url(#grainy);
}
</style>
