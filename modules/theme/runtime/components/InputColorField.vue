<script lang="ts" setup>
import { argbFromHex, hexFromArgb } from '@material/material-color-utilities'

defineProps<{ label?: string }>()

const modelValue = defineModel<number>('modelValue', { type: Number, default: 0 })
const toggled = defineModel<boolean>('toggled', { type: Boolean, default: false })

function toggle() {
  toggled.value = !toggled.value
}

const id = useId()

const proxyValue = computed({
  get: () => hexFromArgb(modelValue.value),
  set: (value: string) => {
    modelValue.value = argbFromHex(value)
  }
})
</script>

<template>
  <div class="relative grid w-full gap-2">
    <div class="my-2 flex flex-nowrap">
      <label
        :for="id"
        class="flex w-full items-center text-title-md font-medium capitalize md:text-headline-sm"
      >
        <slot name="label">
          {{ label || 'Source color' }}
        </slot>
      </label>
    </div>
    <div class="relative flex flex-row">
      <InputText
        :id="id"
        v-model="proxyValue"
        class="h-[34px] w-full pl-[54px] uppercase"
        inputmode="text"
        label="Source Color"
        type="text"
      />
      <InputSRGBHex v-model="proxyValue" />
      <div class="absolute right-0 top-0 w-[48px]">
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
