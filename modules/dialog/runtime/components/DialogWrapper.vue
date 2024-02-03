<script setup lang="ts">
import { dialogs } from '~/modules/dialog/runtime/plugin'
</script>

<template>
  <Teleport to="body">
    <component
      v-for="dialog in dialogs"
      :key="dialog.id"
      :is="dialog.component"
      :id="dialog.id"
      :ref="dialog.setRef"
      v-bind="dialog.props"
    />
  </Teleport>
</template>

<style scoped></style>
