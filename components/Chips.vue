<script lang="ts" setup></script>

<template>
  <div class="chips-root">
    <slot />
  </div>
</template>

<style scoped>
.chips-root {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  margin-block: 1em;

  --_border-radius: 28px;

  &:slotted(> button) {
    @apply h-12 border border-outline-variant;

    &:first-child {
      border-top-right-radius: var(--_border-radius);
      border-bottom-right-radius: var(--_border-radius);
    }

    &:last-child {
      border-top-left-radius: var(--_border-radius);
      border-bottom-left-radius: var(--_border-radius);
    }

    &:not(:first-child) {
      border-left: 0;
    }

    &:not(:last-child) {
      border-right: 0;
    }

    &:not(:first-child):not(:last-child) {
      border-radius: 0;
    }

    &:not(:first-child):not(:last-child):not(:nth-child(2)) {
      border-left: 0;
    }
  }
}
</style>
