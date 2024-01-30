<script lang="ts" setup>
const { $dynamicSchemes, $dynamicScheme } = useNuxtApp()
</script>

<template>
  <div class="custom-grid">
    <div class="main grid md:grid-cols-[auto,1fr,1fr] gap-8">
      <section>
        <JsonPretty :data="$dynamicScheme" />
      </section>
      <section>
        <ColorMode />
        <KeyColorPickers />
      </section>
      <section>
        <ExtractSeedColors />
      </section>
    </div>
  </div>
</template>

<style lang="postcss">
legend {
  @apply mb-4 text-body-lg;
}

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
