<script lang="ts" setup>
const { state, active, isLabeled } = storeToRefs(useNavStore())

const { isMobileOrTablet, isMobile, isTablet, isDesktop, isApple, isAndroid } = useDevice()
</script>

<template>
  <div
    :class="{ isMobileOrTablet, isMobile, isTablet, isDesktop, isApple, isAndroid }"
    class="pb-[80px]"
  >
    <slot />
    <NavBar :active="active" :items="state" :labeled="isLabeled" />
  </div>
  <DialogsRoot />
</template>

<style scoped></style>
