<script lang="ts" setup></script>

<template>
  <DarkToggle v-slot="{ toggle, isDark }">
    <Button intent="text" @click="toggle">
      <Icon v-if="isDark.value" class="size-6" name="ic:round-light-mode" />
      <Icon v-else class="size-6" name="ic:round-dark-mode" />
    </Button>
  </DarkToggle>
</template>

<style scoped></style>
