<script lang="ts" setup></script>

<template>
  <svg height="0" width="0">
    <filter id="grainy" height="100%" width="100%" x="0" y="0">
      <feTurbulence baseFrequency=".537" type="fractalNoise"></feTurbulence>
      <feColorMatrix type="saturate" values="0"></feColorMatrix>
      <feBlend in="SourceGraphic" in2="" mode="multiply"></feBlend>
    </filter>
  </svg>
  <div></div>
</template>

<style scoped>
/* ===== Relevant styles ===== */
svg[height='0'] {
  position: fixed;
}

div {
  background: radial-gradient(circle, mediumturquoise, darkslateblue)
    /* also works with an actual image,
   * not just with a CSS gradient *
  url(https://images.unsplash.com/photo-1633596683562-4a47eb4983c5?w=1400)
    50%/ cover/**/;
  filter: url(#grainy);
}
</style>
