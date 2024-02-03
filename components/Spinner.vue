<template>
  <Transition :duration="100" appear name="fade">
    <Icon class="size-6" name="svg-spinners:clock" />
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 100ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
