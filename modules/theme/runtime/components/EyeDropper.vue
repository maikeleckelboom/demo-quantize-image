<script lang="ts" setup>
const { open, sRGBHex } = useEyeDropper()

const modelValue = defineModel<string>()

whenever(sRGBHex, () => {
  modelValue.value = sRGBHex.value
})
</script>

<template>
  <Button class="rounded-lg" intent="text" @click="open">
    <Icon class="h-3 w-3" name="ic:baseline-colorize" />
  </Button>
</template>

<style lang="postcss"></style>
