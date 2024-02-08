<script lang="ts" setup>
import type { ColorPickerOptions } from '~/modules/dialog/runtime/factory'
import type { DialogComponent } from '#components'
import KeyColorSettings from '~/modules/theme/runtime/components/ColorPicker/KeyColorSettings.vue'

const props = withDefaults(defineProps<ColorPickerOptions>(), {
  keyColor: 'Key Color',
  initialColor: 0
})

const root = ref<InstanceType<typeof DialogComponent>>()

const { isTop } = useStack()

const { close } = useDialogs()

function exit() {
  if (!isTop.value) return
  close(null)
}

const localColor = ref<number>(props.initialColor)

const colorValue = computed({
  get: () => localColor.value,
  set: (v) => {
    props.onColorChange(v)
    localColor.value = v
  }
})

provide('initialColor', props.initialColor)

function save() {
  close(localColor.value)
}

function getKeyColorName(keyColor: string) {
  return sentenceCase(`sourceColor` === keyColor ? keyColor : `${keyColor} Key Color`)
}

const selected = ref<boolean>(false)
</script>

<template>
  <DialogBackdrop>
    <DialogComponent ref="root" @close="exit">
      <template #header>
        <h1 class="text-headline-sm font-medium capitalize">{{ getKeyColorName(keyColor) }}</h1>
      </template>
      <template #header-actions>
        <IconButton :selected="selected" @click="selected = !selected">
          <Icon v-if="selected" name="ic:round-star" />
          <Icon v-else name="ic:round-star-border" />
        </IconButton>
      </template>
      <div class="relative mx-auto max-w-xl">
        <KeyColorSettings v-model="colorValue" />
      </div>
      <template #footer>
        <Buttons class="mb-4 ml-auto w-fit">
          <Button intent="text" @click="exit">Cancel</Button>
          <Button intent="outlined" @click="save">Save</Button>
        </Buttons>
      </template>
    </DialogComponent>
  </DialogBackdrop>
</template>

<style scoped></style>
