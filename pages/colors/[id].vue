<script lang="ts" setup>
import { TonalPalette } from '@material/material-color-utilities'

definePageMeta({
  title: 'Color',
  description: 'Color description'
})

const route = useRoute()

const { $dynamicScheme } = useNuxtApp()

const keyColor = computed(() => {
  const id = route.params.id
  const palette = $dynamicScheme.value[id as keyof typeof $dynamicScheme.value]
  if (palette instanceof TonalPalette) {
    return palette.keyColor
  }
  if (id === 'sourceColor') {
    return $dynamicScheme.value.sourceColorHct
  }
  return null
})

function formatKey(key: string) {
  return key
    .split(/(?=[A-Z])/)
    .filter((s) => s !== 'palette' && s !== 'key' && s !== 'color')
    .map((s) => s.toLowerCase())
    .join(' ')
}

const keyColorName = computed(() => {
  const id = route.params.id
  return formatKey(<string>id)
})

function onBack() {
  if (!document?.startViewTransition) {
    navigateTo({
      path: '/colors'
    })
    return
  }

  document.startViewTransition(() => {
    navigateTo({
      path: '/colors'
    })
  })
}

const { Escape } = useMagicKeys()

whenever(Escape, onBack)

const value = ref(keyColor.value?.toInt())
</script>

<template>
  <DialogComponent @close="onBack">
    <div class="mx-auto flex w-full max-w-xl flex-col p-4">
      <h1 class="mb-4 capitalize">{{ keyColorName }}</h1>
      <KeyColorSettings v-model="value" />
      <div class="mt-4">
        <Button @click="onBack"> Back</Button>
      </div>
    </div>
  </DialogComponent>
</template>

<style></style>
