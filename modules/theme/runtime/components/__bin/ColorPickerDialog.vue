<script lang="ts" setup>
import type { ColorPickerOptions } from '~/modules/dialog/runtime/factory'
import type { DialogComponent } from '#components'

const props = withDefaults(defineProps<ColorPickerOptions>(), {
  keyColor: 'Fallback Color',
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
</script>

<template>
  <DialogBackdrop>
    <DialogComponent ref="root" open @close="exit">
      <KeyColorModel v-model="colorValue" :label="keyColor" />
      <Buttons class="mb-4 ml-auto mt-6 w-fit">
        <Button intent="text" @click="exit">Cancel</Button>
        <Button intent="outlined" @click="close(localColor)">
          Apply
          <Icon class="ml-2" name="ic:baseline-join-right" />
        </Button>
      </Buttons>
    </DialogComponent>
  </DialogBackdrop>
</template>

<style scoped>
.v-dialog-container {
}
</style>
