<script lang="ts" setup></script>

<template>
  <div class="segmented-group-root">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.segmented-group-root {
  --_margin-block-end: 1em;
  --_border-radius: 28px;
  margin-block-end: var(--_margin-block-end);
  @apply flex flex-row flex-nowrap items-stretch;

  &:slotted(> *) {
    @apply h-12 border border-outline-variant;
    @apply flex flex-row flex-nowrap items-center px-4;
    @apply text-label-lg leading-none;

    &:exactactive {
      @apply bg-surface-level-3;
    }

    &:hover {
      @apply bg-surface-level-1;
    }

    &.active {
      @apply bg-surface-level-2;

      &:exactactive {
        @apply bg-surface-level-3;
      }
    }

    .icon {
      margin-right: 8px;
    }

    &:first-child {
      border-top-left-radius: var(--_border-radius);
      border-bottom-left-radius: var(--_border-radius);
    }

    &:last-child {
      border-top-right-radius: var(--_border-radius);
      border-bottom-right-radius: var(--_border-radius);
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
