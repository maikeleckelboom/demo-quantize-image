<script lang="ts" setup>
const isVisible = ref<boolean>(true)

const { sourceColor } = useThemeConfig()

const { state, active } = useNavStore()
</script>

<template>
  <div class="mx-auto w-full max-w-2xl p-4">
    <NavBar :active="active" :items="state" />
  </div>
</template>

<style scoped></style>
