<script lang="ts" setup>
const disabled = ref(false)

const maxColors = ref(0)
const balance = ref(0)
const volume = ref(0)
const treble = ref(0)
const bass = ref(0)
const mid = ref(0)
const echo = ref(0)
const reverb = ref(0)
const temperature = ref(0)
const tint = ref(0)
</script>

<template>
  <div class="mx-auto w-full max-w-4xl gap-y-24 p-6 md:max-w-4xl">
    <div class="mb-12 mt-4">
      <Button class="rounded-md" intent="outlined" size="sm" @click="disabled = !disabled">
        {{ disabled ? 'Enable' : 'Disable' }}
      </Button>
    </div>

    <!-- Styled -->
    <div class="mb-12 flex flex-col gap-12">
      <h1>Custom Styled</h1>
      <section class="mb-12 flex flex-col gap-8">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <fieldset class="relative flex flex-col gap-4">
            <legend>Horizontal - ltr</legend>
            <InputAppSlider v-model="maxColors" :disabled="disabled" />
          </fieldset>
          <fieldset class="relative flex flex-col gap-4">
            <legend>Horizontal - ltr - contained</legend>
            <InputAppSlider v-model="maxColors" :disabled="disabled" contained="true" />
          </fieldset>
          <fieldset class="relative flex flex-col gap-4">
            <legend>Horizontal - rtl</legend>
            <InputAppSlider v-model="maxColors" :disabled="disabled" dir="rtl" />
          </fieldset>
          <fieldset class="relative flex flex-col gap-4">
            <legend>Horizontal - rtl - contained</legend>
            <InputAppSlider v-model="maxColors" :disabled="disabled" contained="true" dir="rtl" />
          </fieldset>
        </div>
      </section>
      <section class="mb-12 flex flex-col gap-12">
        <div class="grid grid-cols-2 place-items-center gap-8 md:grid-cols-4">
          <fieldset class="relative flex flex-col items-center justify-center gap-4">
            <legend>Vertical - ttb</legend>
            <InputAppSlider v-model="balance" :disabled="disabled" orientation="vertical" />
          </fieldset>
          <fieldset class="relative flex flex-col items-center justify-center gap-4">
            <legend>Vertical - ttb - contained</legend>
            <InputAppSlider
              v-model="balance"
              :disabled="disabled"
              contained="true"
              orientation="vertical"
            />
          </fieldset>
          <fieldset class="relative flex flex-col items-center justify-center gap-4">
            <legend>Vertical - btt</legend>
            <InputAppSlider v-model="balance" :disabled="disabled" btt="true" orientation="vertical" />
          </fieldset>
          <fieldset class="relative flex flex-col items-center justify-center gap-4">
            <legend>Vertical - btt - contained</legend>
            <InputAppSlider
              v-model="balance"
              :disabled="disabled"
              btt="true"
              contained="true"
              orientation="vertical"
            />
          </fieldset>
        </div>
      </section>
    </div>
    <!-- Un-styled -->
    <div class="mb-12 flex flex-col gap-12">
      <h1>Standard</h1>
      <section class="mb-12 flex flex-col gap-8">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <fieldset class="relative flex flex-col gap-4">
            <legend>Horizontal - ltr</legend>
            <InputSlider v-model="balance" :disabled="disabled" />
          </fieldset>
          <fieldset class="relative flex flex-col gap-4">
            <legend>Horizontal - ltr - contained</legend>
            <InputSlider v-model="balance" :disabled="disabled" contained="true" />
          </fieldset>
          <fieldset class="relative flex flex-col gap-4">
            <legend>Horizontal - rtl</legend>
            <InputSlider v-model="balance" :disabled="disabled" dir="rtl" />
          </fieldset>
          <fieldset class="relative flex flex-col gap-4">
            <legend>Horizontal - rtl - contained</legend>
            <InputSlider v-model="balance" :disabled="disabled" contained="true" dir="rtl" />
          </fieldset>
        </div>
      </section>
      <section class="mb-12 flex flex-col gap-12">
        <div class="grid grid-cols-2 place-items-center gap-8 md:grid-cols-4">
          <fieldset class="relative flex flex-col items-center justify-center gap-4">
            <legend>Vertical - ttb</legend>
            <InputSlider v-model="balance" :disabled="disabled" orientation="vertical" />
          </fieldset>
          <fieldset class="relative flex flex-col items-center justify-center gap-4">
            <legend>Vertical - ttb - contained</legend>
            <InputSlider
              v-model="balance"
              :disabled="disabled"
              contained="true"
              orientation="vertical"
            />
          </fieldset>
          <fieldset class="relative flex flex-col items-center justify-center gap-4">
            <legend>Vertical - btt</legend>
            <InputSlider v-model="balance" :disabled="disabled" btt="true" orientation="vertical" />
          </fieldset>
          <fieldset class="relative flex flex-col items-center justify-center gap-4">
            <legend>Vertical - btt - contained</legend>
            <InputSlider
              v-model="balance"
              :disabled="disabled"
              btt="true"
              contained="true"
              orientation="vertical"
            />
          </fieldset>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
legend {
  @apply mb-2 text-center text-sm font-semibold text-secondary;
  height: 48px;
}
</style>
