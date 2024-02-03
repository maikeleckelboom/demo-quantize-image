<script lang="ts" setup>
import { FeedbackMachine } from '~/machines/FeedbackMachine'

const { snapshot, send } = useMachine(FeedbackMachine)
</script>

<template>
  <div class="relative flex w-96 flex-col rounded-lg bg-surface-container p-4 shadow-lg">
    <div class="ml-auto">
      <Button intent="text" @click="send({ type: 'close' })">Close</Button>
    </div>

    <div v-if="snapshot.matches('closed')">
      <em>Feedback form closed.</em>
      <Button @click="send({ type: 'restart' })">Provide more feedback</Button>
    </div>

    <div v-else class="relative">
      <div v-if="snapshot.matches('prompt')" class="step">
        <h2>How was your experience?</h2>
        <div class="flex justify-end space-x-2">
          <Button class="button" @click="send({ type: 'feedback.good' })">Good</Button>
          <Button class="button" @click="send({ type: 'feedback.bad' })">Bad</Button>
        </div>
      </div>

      <div v-if="snapshot.matches('thanks')" class="step">
        <h2>Thanks for your feedback.</h2>

        <p v-if="snapshot.context.feedback.length > 0">
          "{{ snapshot.context.feedback }}"
        </p>
      </div>

      <form
        v-if="snapshot.matches('form')"
        class="step"
        @submit.prevent="send({ type: 'submit' })"
      >
        <h2>What can we do better?</h2>
        <textarea
          name="feedback"
          placeholder="So many things..."
          rows="{4}"
          @input="
            (ev) => {
              send({
                type: 'feedback.update',
                value: (ev.target as HTMLTextAreaElement).value
              })
            }
          "
        />
        <div class="flex justify-end space-x-2">
          <Button @click="send({ type: 'back' })">Back</Button>
          <Button :disabled="!snapshot.can({ type: 'submit' })">Submit</Button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
textarea {
  @apply mb-4 w-full rounded-lg border-outline bg-surface px-3 py-3 focus:outline-none;
}

h2,
em {
  @apply mb-4 flex text-lg;
}
</style>
