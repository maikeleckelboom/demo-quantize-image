<script lang="ts" setup>
import { useStepper } from '@vueuse/core'
import { reactive } from 'vue'

const form = reactive({
  firstName: 'Jon',
  lastName: '',
  billingAddress: '',
  contractAccepted: false,
  carbonOffsetting: false,
  payment: 'credit-card' as 'paypal' | 'credit-card'
})

const stepper = useStepper({
  'user-information': {
    title: 'User information',
    isValid: () => form.firstName && form.lastName
  },
  'billing-address': {
    title: 'Billing address',
    isValid: () => form.billingAddress?.trim() !== ''
  },
  terms: {
    title: 'Terms',
    isValid: () => form.contractAccepted === true
  },
  payment: {
    title: 'Payment',
    isValid: () => ['credit-card', 'paypal'].includes(form.payment)
  }
})

function submit() {
  if (stepper.current.value.isValid()) stepper.goToNext()
}

function allStepsBeforeAreValid(index: number): boolean {
  return !Array(index)
    .fill(null)
    .some((_, i) => !stepper.at(i)?.isValid())
}
</script>

<template>
  <div>
    <div class="flex justify-center gap-2">
      <div v-for="(step, id, i) in stepper.steps.value" :key="id" class="">
        <button
          :disabled="!allStepsBeforeAreValid(i) && stepper.isBefore(id)"
          @click="stepper.goTo(id)"
          v-text="step.title"
        />
      </div>
    </div>

    <form class="mt-10" @submit.prevent="submit">
      <span class="text-lg font-bold" v-text="stepper.current.value.title" />
      <div class="mt-2 flex flex-col justify-center gap-2">
        <div>
          <div v-if="stepper.isCurrent('user-information')">
            <span>First name:</span>
            <input v-model="form.firstName" class="!mt-0.5" type="text" />
            <span>Last name:</span>
            <input v-model="form.lastName" class="!mt-0.5" type="text" />
          </div>

          <div v-if="stepper.isCurrent('billing-address')">
            <input v-model="form.billingAddress" type="text" />
          </div>

          <div v-if="stepper.isCurrent('terms')">
            <div>
              <input
                id="carbon-offsetting"
                v-model="form.carbonOffsetting"
                class="mr-2"
                type="checkbox"
              />
              <label for="carbon-offsetting"
                >I accept to deposit a carbon offsetting fee</label
              >
            </div>
            <div>
              <input
                id="contract"
                v-model="form.contractAccepted"
                class="mr-2"
                type="checkbox"
              />
              <label for="contract">I accept the terms of the contract</label>
            </div>
          </div>

          <div v-if="stepper.isCurrent('payment')">
            <div>
              <input
                id="credit-card"
                v-model="form.payment"
                class="mr-2"
                type="radio"
                value="credit-card"
              />
              <label for="credit-card">Credit card</label>
            </div>
            <div>
              <input
                id="paypal"
                v-model="form.payment"
                class="mr-2"
                type="radio"
                value="paypal"
              />
              <label for="paypal">PayPal</label>
            </div>
          </div>
        </div>

        <div>
          <button
            v-if="!stepper.isLast.value"
            :disabled="!stepper.current.value.isValid()"
          >
            Next
          </button>
          <button
            v-if="stepper.isLast.value"
            :disabled="!stepper.current.value.isValid()"
          >
            Submit
          </button>
        </div>
      </div>
    </form>

    <div class="mt-12 flex flex-col gap-4">
      <div
        class="border-main h-full w-full space-y-2 overflow-auto rounded border px-4 py-2"
      >
        <span class="font-bold">Form</span>
        <pre v-text="form" />
      </div>

      <div
        class="border-main h-full w-full space-y-2 overflow-auto rounded border px-4 py-2"
      >
        <span class="font-bold">Wizard</span>
        <pre v-text="stepper" />
      </div>
    </div>
  </div>
</template>
