<script lang="ts" setup>
import Dialog from '~/pages/dialog.vue'

const props = defineProps<{
  open?: boolean
}>()

const dialogVariant = cva({
  base: [
    'fixed',
    'inset-0',
    'z-50',
    'bg-surface-container',
    'p-6',
    'text-on-surface',
    'rounded-xl',
    'w-[560px]',
    'max-w-[calc(100svw-32px)]',
    'mx-[16px]',
    'md:mx-auto'
  ],
  variants: {
    open: {
      true: 'grid',
      false: 'hidden'
    }
  }
})

const emit = defineEmits<{
  close: []
}>()

const dialogRef = ref<HTMLDialogElement>()

onClickOutside(dialogRef, () => {
  emit('close')
})
</script>

<template>
  <dialog ref="dialogRef" :class="dialogVariant({ open })" :open="open">
    <article class="scrollbar relative size-full overflow-y-auto overflow-x-clip">
      <slot></slot>
    </article>
  </dialog>
</template>

<style scoped>
dialog::backdrop {
  visibility: hidden;
}
</style>
