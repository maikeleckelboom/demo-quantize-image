<script lang="ts" setup>
import Buttons from '~/modules/button/runtime/components/Buttons.vue'
</script>

<template>
  <div class="mx-auto h-svh w-full max-w-2xl p-4">
    <div class="p-12">
      <NuxtLink to="/dialog">
        <Button intent="outlined">Go to Dialog</Button>
      </NuxtLink>
    </div>
    <div class="flex flex-col gap-12">
      <Buttons>
        <Button intent="text">
          <Icon name="ic:round-cancel" />
          Cancel
        </Button>
        <Button intent="outlined">
          <icon name="ic:round-arrow-right-alt" />
          Apply
        </Button>
      </Buttons>
    </div>
  </div>
</template>

<style scoped></style>
