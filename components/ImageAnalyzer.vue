<script lang="ts" setup>

</script>

<template>
  <div class="box">
    <div class="box__block"></div>
    <div class="box__block"></div>
  </div>
</template>

<style scoped>
body {
  display: flex;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
}

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
  position: relative;
  width: 600px;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  /*     background-image: url(https://fastly.4sqi.net/img/general/600x600/330945952_7mO3x4E65QKvNNnt2N4ya-eB7b7kSq645nISunkGDts.jpg); */
  background-repeat: no-repeat;
}

.box__block {
  position: absolute;
  width: 50%;
  height: 50%;
  filter: grayscale(1);
  background-image: url(https://fastly.4sqi.net/img/general/600x600/330945952_7mO3x4E65QKvNNnt2N4ya-eB7b7kSq645nISunkGDts.jpg);
  transition: transform 1s ease;
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
