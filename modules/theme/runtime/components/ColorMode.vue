<script lang="ts" setup>
import type { ColorModeOption } from '~/modules/theme/types'
import ColorModeSheet from '~/modules/theme/runtime/components/ColorModeSheet.vue'

const { isDark } = useThemeConfig()

const modes = reactive<ColorModeOption[]>([
  { label: 'Light', value: 'light', selected: !isDark.value },
  { label: 'Dark', value: 'dark', selected: isDark.value }
])

const toggleColorMode = (mode: ColorModeOption) => {
  isDark.value = mode.value === 'dark'
  modes.forEach((m) => {
    m.selected = m.value === mode.value
  })
}

const boxStyles = (mode: ColorModeOption) => ({
  'border-primary': mode.selected,
  'border-outline-variant': !mode.selected,
  'border-2 bg-surface-light border-outline-variant-light':
    mode.value === 'light',
  'border bg-surface-dark border-outline-variant-dark': mode.value === 'dark'
})
</script>

<template>
  <div class="flex flex-row gap-4">
    <div
      v-for="mode in modes"
      :key="mode.value"
      role="button"
      @click="toggleColorMode(mode)"
    >
      <div
        :class="boxStyles(mode)"
        class="relative aspect-video min-h-14 overflow-hidden rounded-lg"
      >
        <ColorModeSheet :mode="mode" />
      </div>
      <div
        :class="mode.selected ? 'text-primary' : 'text-on-surface'"
        class="flex items-center justify-start px-2 py-2"
      >
        <Icon
          v-if="mode.selected"
          class="mr-2 h-3.5 w-3.5 md:h-4 md:w-4"
          name="ic:round-check"
        />
        <span class="text-label-sm md:text-label-md">{{ mode.label }}</span>
      </div>
    </div>
  </div>
</template>
