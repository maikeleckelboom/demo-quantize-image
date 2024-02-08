<script lang="ts" setup>
const { dialogs } = useDialogs()

watch(
  dialogs,
  (newDialogs) => {
    if (newDialogs.length) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
  { immediate: true }
)
</script>

<template>
  <Teleport to="body">
    <Component
      :is="dialog.component"
      v-for="dialog in dialogs"
      :id="dialog.id"
      :key="dialog.id"
      :ref="dialog.set"
      v-bind="dialog.props"
    />
  </Teleport>
</template>

<style scoped></style>
