<script lang="ts" setup>
const { open, sRGBHex } = useEyeDropper()

const modelValue = defineModel<string>()

whenever(sRGBHex, () => {
  modelValue.value = sRGBHex.value
})
</script>

<template>
  <Button
    class="h-[38px] w-[38px] rounded-md border-none"
    intent="text"
    size="sm"
    @click="open"
  >
    <Icon class="size-4" name="ic:round-colorize" />
  </Button>
</template>

<style lang="postcss"></style>
