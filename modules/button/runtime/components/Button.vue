<script lang="ts" setup>
interface ButtonProps {
  variant?: 'icon' | 'text' | 'outlined' | 'filled' | 'filled-tonal'
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'filled'
})

const { variant } = toRefs(props)

function test() {
  console.log('test')
}
</script>

<template>
  <button class="v-button" type="button">
    <slot name="leading" />
    <span data-touch-target>
      <slot />
    </span>
    <slot name="trailing" />
  </button>
</template>

<style scoped>
.v-button {
  @apply px-2 py-1.5 rounded-md flex items-center gap-2;
  @apply transition-colors duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white;
}
</style>
