<script lang="ts" setup>
const disabled = ref(false)

const maxColors = ref(128)
const temperature = ref(0)
const tint = ref(0)

/* vertical */
const volume = ref(0)
const balance = ref(0)
const treble = ref(0)
const bass = ref(0)
const mid = ref(0)
const echo = ref(0)
const reverb = ref(0)
</script>

<template>
  <div class="mx-auto w-full max-w-xl p-4">
    <div class="mb-12 flex flex-col gap-8">
      <Button
        class="rounded-md"
        intent="outlined"
        size="sm"
        @click="disabled = !disabled"
      >
        {{ disabled ? 'Enable' : 'Disable' }}
      </Button>
      <div class="grid grid-cols-2 gap-x-8">
        <fieldset class="flex flex-col gap-4">
          <legend>Default</legend>
          <InputSlider v-model="maxColors" :disabled="disabled" />
        </fieldset>
        <fieldset class="flex flex-col gap-4">
          <legend>Contained</legend>
          <InputSlider v-model="maxColors" :disabled="disabled" contained="true" />
        </fieldset>
      </div>
      <div class="grid grid-cols-2 gap-8">
        <fieldset class="flex flex-col gap-4">
          <legend>Vertical Default</legend>
          <InputSlider v-model="balance" :disabled="disabled" orientation="vertical" />
        </fieldset>
        <fieldset class="flex flex-col gap-4">
          <legend>Vertical Contained</legend>
          <InputSlider
            v-model="volume"
            :disabled="disabled"
            contained="true"
            orientation="vertical"
          />
        </fieldset>
      </div>
    </div>
  </div>
</template>

<style scoped>
legend {
  @apply mb-6;
}
</style>
