<script lang="ts" setup>
import type { DialogProps } from '~/modules/dialog/types'

const props = defineProps<{
  variant?: Pick<DialogProps, 'variant'>['variant']
}>()

const slots = defineSlots<{
  header(): any
  body(): any
  footer(): any
}>()
</script>

<template>
  <dialog :data-variant="variant">
    <header>
      <slot name="header" />
    </header>
    <article>
      <slot name="body" />
    </article>
    <footer>
      <slot name="footer" />
    </footer>
  </dialog>
</template>

<style scoped>
dialog {
  @apply bg-surface-container-highest text-on-surface;

  display: flex;
  flex-direction: column;
  inset: 0;
  margin: auto;
  max-block-size: 80vh;
  max-inline-size: min(calc(100% - 48px), 560px);
  position: fixed;
  z-index: 50;

  @supports (max-block-size: 80svh) {
    max-block-size: 80svh;
  }

  > :where(header, article, footer) {
    padding-inline: 24px;
  }

  > header {
    padding-block-start: 24px;

    @apply text-headline-sm;
  }

  > article {
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
    padding-block: 16px 8px;
  }

  > footer {
    column-gap: 8px;
    display: flex;
    justify-content: flex-end;
    padding-block: 16px 24px;
  }

  &[data-variant='basic'] {
    border-radius: 28px;
    min-inline-size: min(280px, calc(100% - 48px));
  }

  &[data-variant='full-screen'] {
    border-radius: 0;
    min-block-size: 100vh;

    @supports (min-block-size: 100svh) {
      min-block-size: 100svh;
      min-inline-size: 100svw;
    }

    min-inline-size: 100vw;
  }
}
</style>
