<script lang="ts" setup>
import { ToggleMachine } from '~/machines/ToggleMachine'

const { snapshot, send } = useMachine(ToggleMachine)
</script>

<template>
  <div class="relative flex w-96 flex-col rounded-lg bg-surface-container p-4 shadow-lg">
    <pre>{{ snapshot }}</pre>
    <div class="flex justify-end space-x-2">
      <Button
        :class="snapshot.matches('active') ? 'active:shadow-lg' : ''"
        @click="send({ type: 'toggle' })"
      >
        {{ snapshot.matches('active') ? 'On' : 'Off' }}
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
