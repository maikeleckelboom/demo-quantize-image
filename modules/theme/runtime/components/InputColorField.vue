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
  <div class="relative flex w-full flex-col justify-start">
    <div class="my-2 flex flex-nowrap">
      <label
        :for="id"
        class="flex w-full items-center text-title-lg font-medium capitalize md:text-headline-md"
      >
        <slot name="label">
          {{ label || 'Untitled Color' }}
        </slot>
      </label>
    </div>
    <div>
      <ColorPreview :color="modelValue" />
    </div>
    <div class="relative my-4 flex flex-row">
      <InputText
        :id="id"
        v-model="proxyValue"
        class="h-[38px] w-full uppercase"
        inputmode="text"
        label="Source Color"
        type="text"
      />
      <div class="left-0 right-0 top-0">
        <Button aria-label="Paste from clipboard" class="rounded-lg" intent="text">
          <template #icon>
            <Icon name="ic:outline-content-paste-go" />
          </template>
        </Button>
      </div>
      <EyeDropper v-model="proxyValue" />
      <Button
        :title="`Show ${toggled ? 'less' : 'more'} details about the color`"
        class="rounded-lg pl-3 pr-3"
        intent="text"
        size="sm"
        @click="toggle"
      >
        <span class="whitespace-nowrap">Details</span>
        <Icon v-if="toggled" class="h-3 w-3" name="ic:baseline-unfold-less" />
        <Icon v-else class="h-3 w-3" name="ic:baseline-unfold-more" />
      </Button>
    </div>
  </div>
</template>
