<script lang="ts" setup>
defineProps<{ label?: string }>()

const modelValue = defineModel<string>('modelValue', { type: String, default: '' })
const toggled = defineModel<boolean>('toggled', { type: Boolean, default: false })

function toggle() {
  toggled.value = !toggled.value
}
</script>

<template>
  <div class="relative w-full gap-x-2">
    <div class="mb-2 flex flex-nowrap">
      <label
        class="flex w-full items-center text-title-md font-medium md:text-headline-sm"
        for="source-color"
      >
        <slot name="label">
          {{ label || 'Source color' }}
        </slot>
      </label>
    </div>
    <div class="relative flex flex-row">
      <InputText
        id="source-color"
        v-model="modelValue"
        class="h-[38px] w-full pl-[54px] uppercase"
        inputmode="text"
        label="Source Color"
        type="text"
      />
      <InputSRGBHex v-model="modelValue" />
      <div class="absolute right-0 top-0 w-[52px]">
        <Button
          :title="`Show ${toggled ? 'less' : 'more'} details about the color`"
          class="w-full rounded-lg pl-3 pr-3"
          intent="text"
          size="sm"
          @click="toggle"
        >
          <Icon v-if="toggled" class="h-3 w-3" name="ic:baseline-unfold-less" />
          <Icon v-else class="h-3 w-3" name="ic:baseline-unfold-more" />
        </Button>
      </div>
    </div>
  </div>
</template>
