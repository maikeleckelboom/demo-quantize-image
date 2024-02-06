<script lang="ts" setup>
const isVisible = ref<boolean>(true)

const { sourceColor } = useThemeConfig()

const { state, active } = useNavStore()
</script>

<template>
  <div>
    <Button @click="isVisible = true">Open dialog</Button>
    <DialogComponent :open="isVisible" @close="isVisible = false">
      <KeyColorModel v-model="sourceColor" />
    </DialogComponent>
    <NavBar :active="active" :items="state" />
  </div>
</template>

<style scoped></style>
