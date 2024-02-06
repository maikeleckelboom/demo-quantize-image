<script lang="ts" setup>
import type { DialogProps } from '~/modules/dialog/types'
import { DialogBackdrop, DialogBox } from '#components'

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
  <DialogBackdrop ref="backdrop">
    <DialogBox ref="dialogBox" variant="basic">
      <template #header>
        {{ headline }}
      </template>
      <template #body>
        <slot>
          {{ text }}
        </slot>
      </template>
      <template #footer>
        <Button intent="text" @click="emit('cancel')">Cancel</Button>
        <Button intent="text" @click="emit('ok')">Ok</Button>
      </template>
    </DialogBox>
  </DialogBackdrop>
</template>

<style scoped></style>
