<script lang="ts" setup>
const clipPathVar = useCssVar('--_clip-path')

const clickedEl = ref<HTMLElement>()

useEventListener('click', (event) => {
  event.stopPropagation()
  clickedEl.value = event.target as HTMLElement
})

watch(
  clickedEl,
  (el) => {
    if (!el) return
    const { top, left, width, height } = el.getBoundingClientRect()
    const scrollbarWidth = window.innerWidth - document.body.clientWidth
    const innerWidth = window.innerWidth - scrollbarWidth
    // const circle = `circle(${Math.hypot(width, height) / 2}px at ${left + width / 2}px ${top + height / 2}px)`
    const square = `inset(${top}px ${innerWidth - left - width}px ${innerHeight - top - height}px ${left}px)`
    clipPathVar.value = square
  },
  { immediate: true }
)
</script>

<template>
  <div class="document-inset">
    <slot></slot>
  </div>
</template>

<style scoped>
.document-inset {
  width: 100svw;
  height: 100svh;
  position: absolute;
  z-index: 50;
  inset: 0;
  pointer-events: none;
  backdrop-filter: blur(20px);
  clip-path: var(--_clip-path, inset(0));
}
</style>
