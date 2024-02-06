<script lang="ts" setup>
const { state, active } = storeToRefs(useNavStore())

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
    <NavBar :active="active" :items="state" />
  </div>
</template>

<style scoped>
.default-layout {
}
</style>
