<script lang="ts" setup>
import type { DialogOptions } from '~/modules/dialog/runtime/factory'

const props = withDefaults(defineProps<DialogOptions>(), {
  type: 'fullScreen'
})

const emit = defineEmits<{
  close: []
}>()

const dialogEl = ref<HTMLDialogElement>()
const backdropEl = ref<HTMLDivElement>()

const { isTop } = useStack()

async function close() {
  if (!isTop.value) return
  emit('close')
}

onClickOutside(dialogEl, () => close())

const dialogVariant = cva({
  base: ['fixed', 'text-on-surface', 'grid grid-rows-[auto,1fr,auto]', 'overflow-hidden'],
  variants: {
    type: {
      fullScreen: ['rounded-none', 'size-full', 'm-0', 'inset-0', 'bg-surface'],
      basic: [
        'rounded-xl',
        'w-[560px]',
        'max-w-[calc(100svw-32px)]',
        'h-fit',
        'mx-auto',
        'bg-surface-container',
        'my-12'
      ]
    }
  }
})

const backdropVariant = cva({
  base: ['fixed', 'h-svh', 'w-svw', 'overflow-hidden', 'bg-scrim/60'],
  variants: {
    isTop: {
      true: ['z-[100]'],
      false: ['z-40']
    }
  }
})

const footerVariant = cva({
  base: ['flex', 'justify-end', 'p-4'],
  variants: {
    type: {
      fullScreen: [],
      basic: []
    }
  }
})

const articleVariant = cva({
  base: ['relative', 'size-full', 'overflow-y-auto', 'overscroll-none'],
  variants: {
    type: {
      fullScreen: [],
      basic: []
    }
  }
})
</script>

<template>
  <div ref="backdropEl" :class="backdropVariant({ isTop })">
    <dialog ref="dialogEl" :class="dialogVariant({ type })">
      <header v-if="$slots['header'] || $slots['header-actions']">
        <div class="mx-auto grid w-full max-w-xl grid-cols-[1fr,auto] gap-x-2 px-4 pt-4 md:px-0">
          <div class="flex flex-nowrap">
            <slot name="header" />
          </div>
          <div class="flex flex-nowrap gap-x-1">
            <slot name="header-actions" />
          </div>
        </div>
      </header>
      <article :class="articleVariant({ type })">
        <div class="relative mx-auto w-full max-w-xl">
          <slot name="breakout" />
        </div>
        <div class="mx-auto w-full max-w-xl">
          <slot></slot>
        </div>
      </article>
      <footer v-if="$slots['footer']" :class="footerVariant({ type })">
        <div class="mx-auto flex w-full max-w-xl items-end justify-end">
          <slot name="footer" />
        </div>
      </footer>
    </dialog>
  </div>
</template>

<style></style>
