<script lang="ts" setup>
import ColorFormatsDetails from '~/modules/theme/runtime/components/ColorPicker/PaletteColorFormats.vue'

const { $dynamicScheme } = useNuxtApp()
const { sourceColor, contrastLevel } = useThemeConfig()

const primaryPalette = computed(() => {
  return $dynamicScheme.value.primaryPalette
})
</script>

<template>
  <div class="custom-grid">
    <div class="main grid gap-8 md:grid-cols-3">
      <section>
        <JsonPretty :data="$dynamicScheme" />
      </section>

      <section>
        <section></section>
        <div class="mb-2 mt-4">
          <KeyColorPickers />
        </div>
      </section>
      <section>
        <ColorModelSupportText />
        <ColorFormatsDetails :palette="primaryPalette" />
      </section>
      <section>
        <ExtractSeedColors />
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
