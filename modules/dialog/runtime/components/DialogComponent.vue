<script lang="ts" setup>
import Dialog from '~/pages/dialog.vue'

const dialogVariant = cva({
  base: ['fixed', 'z-50', 'p-6', 'text-on-surface'],
  variants: {
    type: {
      fullScreen: ['rounded-none', 'w-full', 'h-full', 'm-0', 'inset-0', 'bg-surface', 'p-4'],
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
    <article class="scrollbar relative size-full">
      <slot></slot>
    </article>
  </dialog>
</template>

<style scoped>
dialog::backdrop {
  visibility: hidden;
}
</style>
