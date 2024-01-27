<script lang="ts" setup>
const { isDark } = useThemeConfig();

const isAppearanceTransition =
  typeof document !== 'undefined' &&
  document.startViewTransition &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function toggle(event?: MouseEvent) {
  if (!event || !isAppearanceTransition || !document.startViewTransition) {
    isDark.value = !isDark.value;
    return;
  }

  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  document.documentElement.classList.add('is-transitioning');

  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    await nextTick();
  });

  transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
    document.documentElement.animate(
      {
        clipPath: isDark.value ? clipPath.reverse() : clipPath
      },
      {
        duration: 400,
        easing: 'ease-in',
        pseudoElement: isDark.value ? '::view-transition-old(root)' : '::view-transition-new(root)'
      }
    );
  });

  transition.finished.then(() => {
    document.documentElement.classList.remove('is-transitioning');
  });
}

const context = { isDark, toggle };
</script>

<template>
  <div>
    <slot v-bind="context" />
  </div>
</template>

<!--suppress CssInvalidPseudoSelector -->
<style>
html.is-transitioning {
  cursor: pointer;

  &::view-transition-old(root),
  &::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
  }

  &::view-transition-old(root) {
    z-index: 1;
  }

  &::view-transition-new(root) {
    z-index: 999;
  }
}

html.dark.is-transitioning {
  &::view-transition-old(root) {
    z-index: 999;
  }

  &::view-transition-new(root) {
    z-index: 1;
  }
}
</style>
