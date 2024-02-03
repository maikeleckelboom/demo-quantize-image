<script lang="ts" setup>
import KeyColorModel from '~/modules/theme/runtime/components/KeyColorModel.vue'
import { TonalPalette } from '@material/material-color-utilities'

const { $dynamicScheme, $schemeCssVariables } = useNuxtApp()
const { sourceColor, contrastLevel } = useThemeConfig()

function formatKey(key: string) {
  return key
    .split(/(?=[A-Z])/)
    .map((s) => s.toLowerCase())
    .filter((s) => s !== 'palette' && s !== 'key' && s !== 'color')
    .join(' ')
}

const palettes = computed(() => {
  return Object.keys($dynamicScheme.value).reduce(
    (acc, key) => {
      const palette = $dynamicScheme.value[key as keyof typeof $dynamicScheme.value]
      if (palette instanceof TonalPalette) {
        acc.push({
          key: formatKey(key),
          palette
        })
      }
      return acc
    },
    [] as { key: string; palette: TonalPalette }[]
  )
})
</script>

<template>
  <div class="custom-grid">
    <div class="main">
      <NuxtLink class="text-link mb-4" to="/app">
        <Button intent="outlined"> Go to App</Button>
      </NuxtLink>
      <section>
        <div class="mb-6 grid grid-cols-[1fr,auto]">
          <div class="">
            <details class="mb-4">
              <summary class="mb-0.5 text-label-lg">Source Color</summary>
            </details>
            <div
              :style="{ background: sourceColor }"
              class="aspect-video size-24 rounded-md"
            ></div>
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
      </section>
      <section>
        <details class="mb-4">
          <summary class="col-span-full mb-0.5 text-title-lg">Palettes</summary>
        </details>
        <div class="grid grid-cols-3 gap-4">
          <div v-for="({ key, palette }, idx) in palettes" class="flex flex-col">
            <h1 class="mb-2 capitalize">
              {{ key }}
            </h1>
            <PaletteKeyColorPreview :palette="palette" />
          </div>
        </div>
      </section>
      <section class="">
        <details class="mb-4">
          <summary class="mb-0.5 text-label-lg">Variants</summary>
          <p class="text-sm text-on-surface-variant">
            The different color schemes that are available.
          </p>
        </details>
        <h1 class="sr-only mb-2 text-headline-sm">Variant</h1>
        <SelectVariant />
      </section>
      <section class="mb-6">
        <div class="mb-6 mt-4">
          <KeyColorModel />
        </div>
      </section>
      <section class="flex flex-col rounded-md">
        <ContrastSlider v-model.number="contrastLevel" max="1" min="0" step="0.1" />
      </section>
      <section>
        <ExtractSeedColors />
      </section>
      <section class="flex flex-col gap-4">
        <div>
          <details class="mb-3">
            <summary class="mb-2 text-title-lg">Scheme Definition</summary>
            <p></p>
          </details>
          <JsonPretty :data="$dynamicScheme" :deep="0" />
        </div>
        <div>
          <div class="mb-3">
            <h2 class="mb-2 text-title-lg">Generated Scheme</h2>
            <p></p>
          </div>
          <SchemeColors />
        </div>
      </section>
    </div>
    <div class="aside-right">
      <Glossary />
    </div>
  </div>
</template>

<style lang="postcss">
.custom-grid {
  --gutter-size: max(2%, 5svw);
  display: grid;
  padding: 12px;

  grid-template-columns:
    [gutter] var(--gutter-size) [main] 1fr [aside-right] auto [gutter] var(--gutter-size)
    [gutter] var(--gutter-size);

  .main {
    grid-area: main;
    @apply mx-auto grid gap-8;
  }

  .aside-right {
    grid-area: aside-right;
    @apply hidden w-[300px] flex-col items-start gap-8 md:flex;
  }

  @screen sm {
    grid-template-columns: [gutter] var(--gutter-size) [main] 1fr [gutter] var(
        --gutter-size
      );
    gap: 1rem 2rem;

    .main {
      grid-column: main;
    }
  }
}
</style>
