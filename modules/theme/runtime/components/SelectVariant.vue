<script lang="ts" setup>
import type { Variant } from '~/modules/theme/types'
import type { Chip } from '#components'

const { variant } = useThemeConfig()

const variants = computed(() =>
  schemeVariants.map((v) => ({
    value: v,
    text: v.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    active: v === variant.value
  }))
)

const root = ref<HTMLElement>()
const chips = useTemplateRefsList<InstanceType<typeof Chip>>()

function bbox(el: HTMLElement): DOMRect {
  return el.getBoundingClientRect()
}

const setVariant = async (v: Variant) => {
  const index = variants.value.findIndex((variant) => variant.value === v)
  const chip = chips.value[index]
  if (!chip || !root.value) return

  const chipRect = bbox(chip.$el)
  const containerRect = bbox(root.value)
  root.value.scrollTo({
    left:
      root.value.scrollLeft +
      chipRect.left -
      containerRect.left -
      containerRect.width / 2 +
      chipRect.width / 2,
    behavior: 'smooth'
  })

  await new Promise((resolve) => {
    chip.$el.addEventListener('transitionend', resolve, { once: true })
    variant.value = v
  })
}
</script>

<template>
  <div ref="root" class="scrollbar flex w-full flex-row gap-3 overflow-x-auto p-1 pb-2">
    <Chip
      v-for="variant in variants"
      :key="variant.value"
      :ref="chips.set"
      :aria-pressed="variant.active"
      :selected="variant.active"
      @click="setVariant(variant.value)"
    >
      {{ variant.text }}
    </Chip>
  </div>
</template>

<style scoped></style>
