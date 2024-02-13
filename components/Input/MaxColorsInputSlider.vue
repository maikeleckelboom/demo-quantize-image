<script lang="ts" setup>
import type { SliderProps } from '~/modules/slider/types'
import AppSlider from '~/components/Input/AppSlider.vue'

const modelValue = defineModel<number>({ type: Number, required: true })

defineProps<SliderProps>()
</script>

<template>
  <div class="flex flex-col justify-between">
    <label
      class="mb-2 flex flex-nowrap items-center gap-x-2 text-label-md md:text-label-lg"
      for="maxColors"
    >
      Max Colors
      <span class="text-xs tabular-nums text-on-surface-variant">(1-128)</span>
      <Tooltip class="">
        <button class="flex items-center justify-center p-1">
          <Icon class="mb-0.5 size-3" name="ic:outline-info" />
        </button>
        <template #content> The maximum number of colors to generate from the image.</template>
      </Tooltip>
    </label>
    <div class="grid grid-cols-[1fr,52px] gap-x-3">
      <div class="">
        <AppSlider
          v-model.number="modelValue"
          :disabled="$props.disabled"
          contained="true"
          max="128"
          min="1"
          oversized="true"
          step="1"
        />
      </div>
      <div class="">
        <InputNumberText id="maxColors" v-model.number="modelValue" max="128" min="1" />
      </div>
    </div>
  </div>
</template>
