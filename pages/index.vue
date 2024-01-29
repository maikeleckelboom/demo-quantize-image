<script lang="ts" setup>


const modelValue = ref<number | number[]>(30)
</script>

<template>
  <div class="custom-grid">
    <div class="main flex flex-col gap-8">
      <section class="col-span-full md:col-span-1">
        <KeyColorPickers />
      </section>
      <section>
        <div class="my-12 p-12 grid grid-cols-2">
          <!-- todo: go through all the components and make sure they are using the new slider -->
          <!--
          <fieldset>
            <legend>Original</legend>
            <ExampleRangeSlider v-model="modelValue" />
          </fieldset>
          <fieldset>
            <legend>Refactored</legend>
            <SliderRoot v-model="modelValue" />
          </fieldset>
          -->
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
  padding: 12px;

  .main {
    grid-area: main;
    @apply col-span-full
  }

  grid-template-columns:1fr 1fr;

  @screen sm {
    grid-template-columns: [gutter] var(--gutter-size) [main] 1fr [gutter] var(--gutter-size);
    gap: 1rem 2rem;

    .main {
      grid-column: main;
    }
  }
}
</style>
