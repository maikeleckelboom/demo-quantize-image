<script setup lang="ts">
import type { DialogProps } from '~/modules/dialog/types'
import { type DialogBackdrop, type DialogBox } from '#components'

const { headline = 'Dialog', text = 'Just a simple dialog.' } = defineProps<DialogProps>()

const emit = defineEmits<{
  ok: [data?: any]
  cancel: [reason?: string]
}>()

const backdrop = ref<InstanceType<typeof DialogBackdrop>>()
const dialogBox = ref<InstanceType<typeof DialogBox>>()

onClickOutside(dialogBox, () => {
  emit('cancel', 'click-outside')
})

const { escape } = useMagicKeys()

whenever(escape, () => {
  // emit('cancel', 'escape')
  isOpen.value = false
})

const isOpen = ref<boolean>(false)

onMounted(() => {
  isOpen.value = true
})

onBeforeUnmount(() => {
  isOpen.value = false
})
</script>

<template>
  <DialogBackdrop ref="backdrop" v-if="isOpen">
    <DialogBox intent="basic" ref="dialogBox">
      <template #header>
        {{ headline }}
      </template>
      <template #body>
        {{ text }}
      </template>
      <template #footer>
        <Button intent="text" @click="emit('cancel')">Cancel</Button>
        <Button intent="text" @click="emit('ok')">Ok</Button>
      </template>
    </DialogBox>
  </DialogBackdrop>
</template>

<style scoped></style>
