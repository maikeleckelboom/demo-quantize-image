<script lang="ts" setup>
const target = ref<HTMLElement>()

const { elementX, elementY, isOutside } = useMouseInElement(target)

const cursorRef = ref<HTMLDivElement>()

const xy = computed(() => {
  if (!cursorRef.value) return { x: 0, y: 0 }
  return {
    x: elementX.value - cursorRef.value.clientWidth / 2,
    y: elementY.value - cursorRef.value.clientHeight / 2
  }
})
</script>

<template>
  <div
    ref="cursorRef"
    :class="isOutside ? 'opacity-0' : 'opacity-[0.0]'"
    :style="{
      transform: `translate(${xy.x}px,${xy.y}px)`,
      background:
        'radial-gradient(circle, rgb(var(--on-surface-rgb)), rgb(var(--inverse-surface-rgb)))'
    }"
    class="pointer-events-none absolute left-0 top-0 size-10 overflow-hidden rounded-full opacity-0 mix-blend-color-dodge"
  />
</template>

<style scoped></style>
