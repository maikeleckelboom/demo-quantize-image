<script lang="ts" setup>

</script>

<template>
  <div class="custom-grid">
    <div class="main grid md:grid-cols-2 gap-8">
      <section class="">
        <KeyColorPickers />
      </section>
      <section>
        <ExtractSeedColors />
      </section>
    </div>
  </div>
</template>

<style lang="postcss">
fieldset {
}

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
