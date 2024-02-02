<script lang="ts" setup>
const props = defineProps<{
  label?: string
  min?: string | number
  max?: string | number
  step?: string | number
  round?: string | number
}>()

const localUid = useId()

const modelValue = defineModel<number>()
</script>

<template>
  <div>
    <label :for="localUid" class="text-label-lg">
      {{ label }}
    </label>
    <div class="mt-2 flex flex-row items-center gap-6">
      <MaterialSlider v-model.number="modelValue" v-bind="{ min, max, step, round }" />
      <input
        :id="localUid"
        v-model.number="modelValue"
        class="v-input v-input-type-number"
        type="number"
        v-bind="{ min, max, step }"
      />
    </div>
  </div>
</template>

<style scoped></style>
