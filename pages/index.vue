<script lang="ts" setup>


const modelValue = ref<number | number[]>(30)
</script>

<template>
  <div class="custom-grid">
    <div class="main flex flex-col gap-8">
      <section>
        <KeyColorPickers />
      </section>
      <section>
        <div class="my-12 p-12 grid grid-cols-2">
          <fieldset>
            <legend>Original</legend>
            <ExampleRangeSlider v-model="modelValue" />
          </fieldset>
          <fieldset>
            <legend>Refactored</legend>
            <SliderRoot v-model="modelValue" />
          </fieldset>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="postcss">
fieldset {
}

legend {
  @apply text-body-lg mb-4;
}

.custom-grid {
  --gutter-size: max(2%, 30svw);
  display: grid;
  grid-template-columns: [gutter] var(--gutter-size) [main] 1fr [gutter] var(--gutter-size);
  gap: 1rem 2rem;

  .main {
    grid-area: main;
  }
}
</style>
