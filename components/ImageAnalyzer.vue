<script lang="ts" setup></script>

<template>
  <div class="box">
    <div class="box-block" />
    <div class="box-block" />
  </div>
</template>

<style scoped>
.box {
  --background-w: 200px;
  --background-h: 200px;
  --background-image: var(--background-image-5);

  position: relative;
  width: var(--background-w);
  height: var(--background-h);
  max-width: 100%;

  /*
    background-image: var(--background-image);
    background-repeat: no-repeat;
    background-size: var(--background-w) var(--background-h);
  */

  .box-block {
    position: absolute;
    width: 50%;
    height: 50%;
    filter: grayscale(1);
    background-image: var(--background-image);
    transition: transform 1s ease;
    background-size: var(--background-w) var(--background-h);
  }

  .box-block:first-child {
    top: 0;
    left: 0;
    background-position: left top;
    animation-name: slideInTopRight;
    animation-duration: 4s;
    animation-iteration-count: infinite;
  }

  .box-block:last-child {
    bottom: 0;
    right: 0;
    background-position: right bottom;
    animation-name: slideInBottomLeft;
    animation-duration: 4s;
    animation-iteration-count: infinite;
  }
}

@keyframes slideInTopRight {
  from {
    transform: translate(0);
    background-position: left top;
  }

  25% {
    transform: translateX(100%);
    background-position: right top;
  }

  50% {
    transform: translate(100%, 100%);
    background-position: right bottom;
  }

  75% {
    transform: translateY(100%);
    background-position: left bottom;
  }

  to {
    transform: none;
  }
}

@keyframes slideInBottomLeft {
  from {
    transform: translate(0);
    background-position: right bottom;
  }

  25% {
    transform: translateX(-100%);
    background-position: left bottom;
  }

  50% {
    transform: translate(-100%, -100%);
    background-position: left top;
  }

  75% {
    transform: translateY(-100%);
    background-position: right top;
  }

  to {
    transform: none;
  }
}
</style>
