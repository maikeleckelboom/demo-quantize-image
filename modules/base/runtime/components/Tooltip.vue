<script lang="ts" setup>
import { arrow, autoUpdate, flip, offset, type Placement, shift, useFloating } from '@floating-ui/vue'

interface Props {
  placement?: Placement
  delay?: number | `${number}ms` | `${number}s`
  arrow?: boolean
  classes?: {
    reference?: string
  }
}

const { placement: initialPlacement, delay } = withDefaults(defineProps<Props>(), {
  placement: 'top',
  delay: 0,
  arrow: false
})

const reference = ref<HTMLElement>()
const floating = ref<HTMLElement>()
const floatingArrow = ref<HTMLElement>()

const placement = ref<Placement>(initialPlacement)
const middleware = ref([
  offset(4),
  flip(),
  shift({
    padding: 8
  }),
  arrow({ element: floatingArrow, padding: 4 })
])

const open = ref<boolean>(false)

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

function show() {
  open.value = true
}

function hide() {
  open.value = false
}

onClickOutside(floating, () => {
  hide()
})

const arrowPos = computed(() => ({
  left: middlewareData.value.arrow?.x != null ? `${middlewareData.value.arrow.x}px` : undefined,
  top: middlewareData.value.arrow?.y != null ? `${middlewareData.value.arrow.y}px` : undefined
}))

function getDelay(delay: Props['delay']) {
  return typeof delay === 'number' ? `${delay}ms` : delay
}
</script>

<template>
  <div
    ref="reference"
    :class="$props.classes?.reference"
    class="w-fit"
    v-bind="$attrs"
    @focusin="show"
    @focusout="hide"
    @mouseenter="show"
    @mouseleave="hide"
  >
    <slot />
  </div>
  <div v-if="open" ref="floating" :style="floatingStyles" class="tooltip-container">
    <slot name="content" />
    <div
      v-if="$props.arrow"
      ref="floatingArrow"
      :style="{
        position: 'absolute',
        left: arrowPos.left,
        top: arrowPos.top
      }"
      class="floating-arrow"
    />
  </div>
</template>

<style scoped>
.floating-arrow {
  @apply pointer-events-none absolute bg-inverse-surface;
  --_size: 8px;
  width: var(--_size);
  height: var(--_size);
  transform: translateY(calc(var(--_size) * 0.5));
}

.tooltip-container {
  @apply z-50 max-w-64 rounded-2xl bg-inverse-surface p-2 shadow-2xl;
  @apply text-balance text-center text-body-md font-medium leading-snug text-inverse-on-surface;
}
</style>
