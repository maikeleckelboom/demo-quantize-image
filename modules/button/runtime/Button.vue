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
    <span data-touch-target>
      <slot />
    </span>
  </button>
</template>
