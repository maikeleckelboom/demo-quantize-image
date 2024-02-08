<script lang="ts" setup>
const dialogVariant = cva({
  base: ['fixed', 'z-50', 'text-on-surface', 'grid grid-rows-[auto,1fr,auto]', 'overflow-hidden'],
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
  base: ['relative', 'size-full', 'overflow-y-auto', 'overscroll-none', 'p-4'],
  variants: {
    type: {
      fullScreen: [],
      basic: []
    }
  }
})

const emit = defineEmits<{
  close: []
}>()

const dialogRef = ref<HTMLDialogElement>()

function close() {
  emit('close')
}

const { Escape } = useMagicKeys()
whenever(Escape, () => close())
onClickOutside(dialogRef, () => close())
const fullscreen = ref<boolean>(true)
const type = computed(() => (fullscreen.value ? 'fullScreen' : 'basic'))
</script>

<template>
  <dialog ref="dialogRef" :class="dialogVariant({ type })" open>
    <header>
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
      <slot></slot>
    </article>
    <footer :class="footerVariant({ type })">
      <div class="mx-auto w-full max-w-xl">
        <slot name="footer" />
      </div>
    </footer>
  </dialog>
</template>

<style scoped>
dialog::backdrop {
  visibility: hidden;
}
</style>
