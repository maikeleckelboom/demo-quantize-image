<script lang="ts" setup></script>

<template>
  <div class="box">
    <div class="box__block"></div>
    <div class="box__block"></div>
  </div>
</template>

<style scoped>
@keyframes slidefirstleft {
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

@keyframes slidesecondleft {
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

.box {
  --current-image: var(--background-image-1);

  --background-w: 600px;
  --background-h: 400px;

  position: relative;
  width: var(--background-w);
  height: var(--background-h);
  background-image: var(--current-image);
  background-repeat: no-repeat;
  background-size: var(--background-w) var(--background-h);
}

.box__block {
  position: absolute;
  width: 50%;
  height: 50%;
  filter: grayscale(1);
  background-image: var(--current-image);
  transition: transform 1s ease;
  background-size: var(--background-w) var(--background-h);
}

.box__block:first-child {
  top: 0;
  left: 0;
  background-position: left top;
  animation-name: slidefirstleft;
  animation-duration: 4s;
  animation-iteration-count: infinite;
}

.box__block:last-child {
  bottom: 0;
  right: 0;
  background-position: right bottom;
  animation-name: slidesecondleft;
  animation-duration: 4s;
  animation-iteration-count: infinite;
}
</style>
