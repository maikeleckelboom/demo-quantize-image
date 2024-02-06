<script lang="ts" setup>
const { state, active, isLabelled } = storeToRefs(useNavStore())

const { isMobileOrTablet, isMobile, isTablet, isDesktop, isApple, isAndroid } = useDevice()
</script>

<template>
  <div :class="{ isMobileOrTablet, isMobile, isTablet, isDesktop, isApple, isAndroid }" class="pb-[80px]">
    <slot />
    <div class="fixed inset-x-0 bottom-[92px]">
      <div class="pointer-events-none mx-auto flex size-full max-w-2xl justify-end px-4">
        <Button class="pointer-events-auto" intent="extended-fab" size="lg" variant="primary">
          <Icon name="ic:round-add" />
        </Button>
      </div>
    </div>
    <NavBar :active="active" :items="state" :labeled="isLabelled" />
  </div>
  <DialogsRoot />
</template>

<style scoped></style>
