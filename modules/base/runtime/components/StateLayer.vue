<script lang="ts" setup>
interface Props {
  active: boolean
}

withDefaults(defineProps<Props>(), {
  active: false
})

const opacity = ref<number>(0.1)
</script>

<template>
  <div :style="{ opacity: active ? opacity : 0 }" class="absolute inset-0">
    <slot />
  </div>
</template>

<style scoped></style>
