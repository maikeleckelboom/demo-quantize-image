<script lang="ts" setup>
import { autoUpdate, flip, offset, type Placement, shift, useFloating } from '@floating-ui/vue'

const reference = ref<HTMLElement>()
const floating = ref<HTMLElement>()

const placement = ref<Placement>('top')
const middleware = ref([
  offset(4),
  flip(),
  shift({
    padding: 8
  })
])

const open = ref<boolean>(false)
const manualOpen = ref<boolean>(false)

const { floatingStyles, middlewareData, isPositioned, update } = useFloating(reference, floating, {
  placement,
  open,
  whileElementsMounted: autoUpdate,
  middleware
})

watch(isPositioned, async (isPositioned) => {
  if (isPositioned) {
  }
})

function toggleOpen() {
  manualOpen.value = !manualOpen.value
  nextTick(() => {
    open.value = manualOpen.value
  })
}

function onMouseenter() {
  if (!manualOpen.value) {
    open.value = true
  }
}

function onMouseleave() {
  if (!manualOpen.value) {
    open.value = false
  }
}

onClickOutside(floating, () => {
  open.value = false
})
</script>

<template>
  <div
    ref="reference"
    @focusin="open = true"
    @focusout="open = false"
    @mouseenter="onMouseenter"
    @mouseleave="onMouseleave"
  >
    <slot />
  </div>
  <div v-if="open" ref="floating" :style="floatingStyles" class="tooltip-container">
    <slot name="content" />
  </div>
</template>

<style scoped>
.tooltip-container {
  @apply z-50 max-w-64 text-balance rounded-2xl bg-inverse-surface p-2 text-center text-body-md font-medium leading-snug text-inverse-on-surface shadow-2xl;
}
</style>
