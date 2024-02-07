<script lang="ts" setup>
import HctMathEquation from '~/components/HctMathEquation.vue'

withDefaults(
  defineProps<{
    keyColor?: string
  }>(),
  {
    keyColor: ''
  }
)

const modelValue = defineModel<number>('modelValue', { type: Number, default: 0 })

function getKeyColorName(keyColor: string) {
  return sentenceCase(`sourceColor` === keyColor ? keyColor : `${keyColor} Key Color`)
}

const isTextExpanded = ref<boolean>(false)
</script>

<template>
  <div class="grid">
    <h1 class="mb-6 text-headline-sm font-medium capitalize">{{ getKeyColorName(keyColor) }}</h1>
    <ColorPreview :color="modelValue" />
    <div class="flex flex-col">
      <Collapsible v-model="isTextExpanded" class="mb-4">
        <template #trigger>
          <h2
            class="mb-4 mt-8 cursor-default select-none text-headline-sm leading-none tracking-wide"
            @click="isTextExpanded = !isTextExpanded"
          >
            HCT
            <Icon
              :name="isTextExpanded ? 'ic:round-unfold-more' : 'ic:round-unfold-less'"
              class="my-auto mb-1 ml-1 size-5"
            />
          </h2>
        </template>
        <p class="text-on-surface-variant">
          HCT is an abbreviation of hue chroma tone . It’s the name of the color space that enables dynamic
          color. HCT is based on CAM16 hue and chroma; the L* construct for luminance from L*a*b* (CIELAB,
          1976) is denoted as T for tone.
        </p>
        <HctMathEquation class="mt-2 text-xl leading-loose" />
      </Collapsible>
    </div>
    <HctColorPicker v-model="modelValue" />
  </div>
</template>
