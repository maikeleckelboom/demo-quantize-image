<script lang="ts" setup>
const { dialogs } = useDialogs()
</script>

<template>
  <Teleport to="body">
    <component
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
