<script lang="ts" setup>
import type {CSSProperties} from "vue";

interface Props {
  fill?: boolean | 'true' | 'false' | CSSProperties
}

const props = withDefaults(defineProps<Props>(), {
  fill: true
})

function getFillStyle() {
  if (typeof props.fill === 'object') {
    return props.fill
  }
  return {}
}

const hasFill = computed(() => {
  return isTruthy(props.fill)
})
</script>

<template>
  <div class="slider-track">
    <slot/>
    <SliderTrackFill v-if="hasFill" :style="getFillStyle()">
      <slot name="fill"/>
    </SliderTrackFill>
  </div>
</template>

<style scoped>

</style>
