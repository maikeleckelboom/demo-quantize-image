<script lang="ts" setup>
import type { DialogComponent } from '#components'
import type { SelectColorsProps } from '~/modules/dialog/runtime/factory'
import { hexFromArgb } from '@material/material-color-utilities'

const props = withDefaults(defineProps<SelectColorsProps>(), {
  prominent: () => new Map(),
  seed: () => []
})

const { close } = useDialogs()

const localSelectedProminent = ref(new Map<number, boolean>())
const localSelectedSeed = ref<number[]>([])

function selectProminent(color: number) {
  localSelectedProminent.value.set(color, !localSelectedProminent.value.get(color))
}

function selectSeed(color: number) {
  const index = localSelectedSeed.value.indexOf(color)
  if (index === -1) {
    localSelectedSeed.value.push(color)
  } else {
    localSelectedSeed.value.splice(index, 1)
  }
}

function isSelectedProminent(color: number) {
  return localSelectedProminent.value.get(color)
}

function isSelectedSeed(color: number) {
  return localSelectedSeed.value.includes(color)
}

function getSelectedProminent() {
  return Array.from(localSelectedProminent.value.keys())
}

function getSelectedSeed() {
  return localSelectedSeed.value
}

function arrayFromMap(map: Map<number, number>) {
  return Array.from(map.keys())
}

const seed = computed(() => props.seed)
const prominent = computed(() => arrayFromMap(props.prominent))

function onClose() {
  close()
}
</script>

<template>
  <DialogComponent ref="root" type="basic" @close="onClose">
    <div class="grid grid-cols-[1fr,auto] gap-x-4">
      <div class="flex flex-wrap gap-1">
        <div v-for="color in prominent" :key="color" class="flex">
          <div
            :style="{ backgroundColor: hexFromArgb(color) }"
            class="size-6 rounded-full"
            @click="selectProminent(color)"
          ></div>
        </div>
      </div>
      <div class="flex flex-col items-start gap-y-2">
        <div
          v-for="color in seed"
          :key="color"
          :style="{ backgroundColor: hexFromArgb(color) }"
          class="size-24 rounded-full"
          @click="selectSeed(color)"
        ></div>
      </div>
    </div>
  </DialogComponent>
</template>

<style scoped></style>
