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
  console.log('save')
}
</script>

<template>
  <DialogBackdrop>
    <DialogComponent ref="root" open @close="exit">
      <div class="relative mx-auto max-w-xl">
        <KeyColorSettings v-model="colorValue" :key-color="keyColor" />
        <Buttons class="mb-4 ml-auto mt-6 w-fit">
          <Button intent="text" @click="exit">Cancel</Button>
          <Button intent="outlined" @click="close(localColor)">Save</Button>
        </Buttons>
      </div>
    </DialogComponent>
  </DialogBackdrop>
</template>

<style scoped></style>
