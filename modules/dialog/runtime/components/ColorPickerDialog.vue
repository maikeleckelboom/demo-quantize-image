<script lang="ts" setup>
import type { ColorPickerOptions } from '~/modules/dialog/runtime/factory'

const props = withDefaults(defineProps<ColorPickerOptions>(), {
  keyColor: 'Fallback Color',
  initialColor: 0
})

const root = ref<HTMLElement>()

const { isTop } = useStack()

const { close } = useDialogs()

onClickOutside(root, () => {
  if (!isTop.value) return
  close(null)
})

const localColor = ref<number>(props.initialColor)

const colorValue = computed({
  get: () => localColor.value,
  set: (v) => {
    props.onColorChange(v)
    localColor.value = v
  }
})
</script>

<template>
  <DialogBackdrop>
    <div ref="root" class="v-dialog-container">
      <DialogComponent open>
        <KeyColorModel v-model="colorValue" :label="sentenceCase(keyColor)" />
      </DialogComponent>
    </div>
  </DialogBackdrop>
</template>

<style scoped>
.v-dialog-container {
}
</style>
