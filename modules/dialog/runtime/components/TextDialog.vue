<script lang="ts" setup>
defineProps<{
  title: string
  text?: string
}>()

const { isTop } = useStack()

const rootEl = ref<HTMLElement>()

const { close } = useDialogs()

onClickOutside(rootEl, () => {
  if (!isTop.value) return
  close(null)
})
</script>
<template>
  <div class="fixed z-50 h-svh w-svw bg-scrim/40">
    <div ref="rootEl" class="v-dialog-container pointer-events-auto">
      <p class="text-2xl font-bold">{{ title }}</p>
      <p v-if="text" class="text-lg">{{ text }}</p>
    </div>
  </div>
</template>

<style scoped>
.v-dialog-container {
  @apply mx-auto max-w-[560px] rounded-lg bg-surface-container-highest p-8 text-on-surface md:my-40;
}
</style>
