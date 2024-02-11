<script lang="ts" setup>
const disabled = ref(false)

const maxColors = ref(128)
const temperature = ref(0)
const tint = ref(0)
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
      <fieldset class="flex flex-col gap-4">
        <legend>Contained</legend>
        <InputSlider
          v-model="maxColors"
          :disabled="disabled"
          contained="true"
          max="128"
          min="1"
          step="1"
        />
      </fieldset>
      <fieldset class="flex flex-col gap-4">
        <legend>Not Contained</legend>
        <InputSlider
          v-model="maxColors"
          :disabled="disabled"
          contained="false"
          max="128"
          min="1"
          step="1"
        />
      </fieldset>
    </div>
  </div>
</template>

<style></style>
