<script lang="ts" setup>
import KeyColorModel from '~/modules/theme/runtime/components/KeyColorModel.vue'

const { $dynamicScheme, $schemeCssVariables } = useNuxtApp()
const { sourceColor, contrastLevel } = useThemeConfig()
</script>

<template>
  <div class="custom-grid">
    <div class="main grid gap-8 md:grid-cols-1 lg:grid-cols-3">
      <section class="mb-6">
        <div class="mb-6 grid grid-cols-[1fr,auto]">
          <div class="">
            <div class="mb-4">
              <h2 class="mb-0.5 text-label-lg">Source Color</h2>
              <p class="text-sm text-on-surface-variant">The color that is used as the base for the theme.</p>
            </div>
            <div :style="{ background: sourceColor }" class="aspect-video size-24 rounded-md"></div>
          </div>
          <div class="flex">
            <DarkToggle v-slot="{ toggle, isDark }">
              <button class="p-4" @click="toggle">
                <Icon v-if="isDark.value" class="size-6" name="ic:round-light-mode" />
                <Icon v-else class="size-6" name="ic:round-dark-mode" />
              </button>
            </DarkToggle>
          </div>
        </div>
        <div class="mb-2 mt-4">
          <KeyColorModel />
        </div>
      </section>
      <section>
        <ExtractSeedColors />
      </section>
      <section class="flex flex-col gap-4">
        <div>
          <div class="mb-3">
            <h2 class="mb-2 text-title-lg">Definition</h2>
            <p></p>
          </div>
          <JsonPretty :data="$dynamicScheme" :deep="0" />
        </div>
        <div>
          <div class="mb-3">
            <h2 class="mb-2 text-title-lg">Scheme</h2>
            <p></p>
          </div>
          <SchemeColors />
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="postcss">
.custom-grid {
  --gutter-size: max(2%, 5svw);
  display: grid;
  padding: 12px;

  .main {
    grid-area: main;
    @apply col-span-full;
  }

  grid-template-columns: 1fr 1fr;

  @screen sm {
    grid-template-columns: [gutter] var(--gutter-size) [main] 1fr [gutter] var(--gutter-size);
    gap: 1rem 2rem;

    .main {
      grid-column: main;
    }
  }
}
</style>
