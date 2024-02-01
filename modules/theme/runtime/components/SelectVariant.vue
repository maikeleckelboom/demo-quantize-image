<script lang="ts" setup>
import type { Variant } from '~/modules/theme/types'

const { variant } = useThemeConfig()

const variants = computed(() =>
  variantKeys.map((v) => ({
    value: v,
    text: v.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    active: v === variant.value
  }))
)

const setVariant = (v: Variant) => {
  variant.value = v
}
</script>

<template>
  <div class="scrollbar flex max-w-[calc(100svw-24px)] flex-row gap-3 overflow-x-auto px-1 py-2">
    <Chip
      v-for="variant in variants"
      :key="variant.value"
      :aria-pressed="variant.active"
      :selected="variant.active"
      selected-icon="ic:round-check"
      @click="setVariant(variant.value)"
    >
      {{ variant.text }}
    </Chip>
  </div>
</template>

<style scoped></style>
