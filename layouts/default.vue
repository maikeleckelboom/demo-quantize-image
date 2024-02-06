<script lang="ts" setup>
const { state, active } = storeToRefs(useNavStore())
</script>

<template>
  <div class="pb-[80px] pt-[60px]">
    <slot />
    <NavBar :active="active" :items="state" />
  </div>
</template>

<style scoped>
.default-layout {
}
</style>
