<script lang="ts" setup>
import MaxColorsInputSlider from '~/components/MaxColorsInputSlider.vue'

const disabled = ref(false)

const maxColors = ref(128)
const temperature = ref(0)
const tint = ref(0)
</script>

<template>
  <div class="mx-auto w-full max-w-xl p-4">
    <div class="mb-12 flex flex-col gap-8">
      <fieldset class="flex flex-col gap-4">
        <legend>Contained === true</legend>
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
        <legend>Contained === false</legend>
        <InputSlider
          v-model="maxColors"
          :disabled="disabled"
          contained="false"
          max="128"
          min="1"
          step="1"
        />
      </fieldset>
      <fieldset class="flex flex-col gap-4">
        <legend>Temperature</legend>
        <InputSlider
          v-model="temperature"
          :disabled="disabled"
          max="100"
          min="-100"
          step="1"
        />
      </fieldset>
      <fieldset class="flex flex-col gap-4">
        <legend>Tint</legend>
        <MaxColorsInputSlider
          v-model="tint"
          :disabled="disabled"
          max="100"
          min="-100"
          step="1"
        />
      </fieldset>
    </div>
  </div>
</template>

<style></style>
