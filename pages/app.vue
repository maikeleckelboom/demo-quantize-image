<script lang="ts" setup></script>

<template>
  <div class="mx-auto h-svh w-full max-w-2xl p-4">
    <div class="p-12">
      <NuxtLink to="/dialog">
        <Button>Open dialog</Button>
      </NuxtLink>
    </div>
    <div class="p-12">
      <ContrastSlider />
    </div>
    <div class="flex flex-col gap-12">
      <Button intent="outlined">
        <Icon name="ic:round-save" />
        Save
      </Button>
      <Button intent="text">
        <Icon name="ic:round-cancel" />
        Cancel
      </Button>
      <Button intent="elevated"> Extract from image</Button>

      <Button color="tertiary" intent="fab" size="sm">
        <Icon name="ic:round-add" />
      </Button>
      <Button color="primary" intent="fab" size="lg">
        <Icon name="ic:round-add" />
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
