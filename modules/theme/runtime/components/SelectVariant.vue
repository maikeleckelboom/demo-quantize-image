<script lang="ts" setup>
import { variantKeys } from '~/modules/theme/runtime/utils/color'
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
  <div>
    <div class="flex flex-row gap-3">
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
  </div>
</template>

<style scoped>
.inline-box {
}

.chip-box {
}
</style>
