<script lang="ts" setup>
import type { ColorModeOption } from '~/modules/theme/types'

const { mode } = defineProps<{
  mode?: ColorModeOption
}>()
</script>

<template>
  <div
    v-if="mode"
    :class="{
      'border-outline-variant-light bg-surface-container-highest-light text-on-surface-light':
        mode.value === 'light',
      'border-outline-variant-dark bg-surface-container-high-dark text-on-surface-dark':
        mode.value === 'dark'
    }"
    class="rounded-tr-0 absolute bottom-0 right-0 h-3/4 w-5/6 rounded-tl-lg border-thin border-b-0 px-2 py-1 md:px-2.5 md:py-2"
  >
    <p
      :class="mode.value === 'light' ? 'font-extrabold' : 'font-bold'"
      class="text-body-sm tracking-wide"
    >
      Aa
    </p>
  </div>
</template>
