<script lang="ts" setup>
const { state, active, isLabelled } = storeToRefs(useNavStore())

const { isMobileOrTablet, isMobile, isTablet, isDesktop } = useDevice()
</script>

<template>
  <div
    :class="{
      'v-mobile': isMobile,
      'v-tablet': isTablet,
      'v-desktop': isDesktop,
      'v-mobile-or-tablet': isMobileOrTablet
    }"
    class="pb-[80px]"
  >
    <slot />
    <div class="fixed inset-x-0 bottom-24">
      <div class="pointer-events-none mx-auto flex size-full max-w-2xl justify-end px-4">
        <Button class="pointer-events-auto" color="primary" intent="extended-fab">
          <Icon name="ic:round-add" />
        </Button>
      </div>
    </div>
    <NavBar :active="active" :items="state" :labelled="isLabelled" />
  </div>
</template>

<style scoped></style>
