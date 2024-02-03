<script lang="ts" setup>
import { schemeVariants } from '~/modules/theme/runtime/utils/color'
import type { Variant } from '~/modules/theme/types'

const { variant, contrastLevel } = useThemeConfig()

const variantKeys = Object.keys(variantKeys) as any

const variantOptions = computed(() =>
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
  <div
    class="scrollbar grid gap-8 overflow-y-auto p-4 sm:grid-cols-[auto,1fr] md:p-0"
  >
    <div class="w-full max-w-md">
      <section class="mb-4 flex flex-col gap-4"></section>
      <section class="mb-4 flex flex-col gap-4">
        <fieldset class="rounded-md border-outline/50 p-4">
          <legend>Color Mode</legend>
          <ColorMode />
        </fieldset>
        <fieldset class="rounded-md border-outline/50 p-4">
          <legend>Variant</legend>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="variant in variantOptions"
              :key="variant.value"
              :aria-pressed="variant.active"
              :class="{ 'border-outline bg-surface-level-1': variant.active }"
              class="flex cursor-pointer items-center gap-x-2 rounded-full border-surface-container px-4 py-2 text-label-lg leading-none hover:border-outline-variant/50 hover:bg-surface-level-1"
              @click="setVariant(variant.value)"
            >
              <Icon
                v-if="variant.active"
                class="mr-1 size-4"
                name="ic:round-check"
              />
              {{ variant.text }}
            </button>
          </div>
        </fieldset>
      </section>
    </div>
  </div>
</template>
