<template>
  <Transition :duration="100" appear name="fade">
    <Icon key="clock" class="size-6" name="svg-spinners:clock" />
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
