<script lang="ts" setup>
const { state, active, isLabelled } = storeToRefs(useNavStore())

const { isMobileOrTablet, isMobile, isTablet, isDesktop, isApple, isAndroid } = useDevice()

function onFabClick() {
  console.log('FAB clicked')
}
</script>

<template>
  <div :class="{ isMobileOrTablet, isMobile, isTablet, isDesktop, isApple, isAndroid }" class="pb-[80px]">
    <slot />
    <NavBar :active="active" :items="state" :labeled="isLabelled" />
  </div>
  <DialogsRoot />
</template>

<style scoped></style>
