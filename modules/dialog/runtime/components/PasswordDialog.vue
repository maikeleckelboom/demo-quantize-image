<script setup lang="ts">
import type { PasswordDialogProps } from '~/modules/dialog/runtime'
import { closeDialog } from '~/modules/dialog/runtime/plugin'

const props = defineProps<PasswordDialogProps>()

const password = ref<string>('')

const errorMessage = ref<string>('')
const isLoading = ref<boolean>(false)

const validate = async (e: Event) => {
  e.preventDefault()
  errorMessage.value = ''
  isLoading.value = true
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000))
  if (password.value !== '123456') {
    errorMessage.value = 'Password is incorrect'
    isLoading.value = false
    return
  }

  await closeDialog(password.value)
}

defineExpose({
  returnValue: () => password.value
})
</script>

<template>
  <AppDialog intent="basic">
    <template #icon>
      <Icon name="ic:round-security" />
    </template>
    <form @submit="validate" class="w-full">
      <fieldset class="flex w-full flex-col">
        <label for="password" class="mb-3 text-label-lg">
          <slot name="password-label">
            {{ inputLabel }}
          </slot>
        </label>
        <input
          id="password"
          type="password"
          @keydown.enter="validate"
          autocomplete="current-password"
          class="h-[48px] rounded border border-primary bg-surface px-2 text-body-sm"
          v-model="password"
        />
      </fieldset>
      <div class="flex pt-3">
        <span class="text-body-sm text-error">{{ errorMessage }}</span>
      </div>
    </form>
    <template #actions>
      <Button intent="text" @click="validate" :disabled="isLoading">
        <p v-if="isLoading">Loading ...</p>
        <p v-else>{{ confirmLabel ?? 'Confirm' }}</p>
      </Button>
    </template>
  </AppDialog>
</template>

<style scoped></style>
