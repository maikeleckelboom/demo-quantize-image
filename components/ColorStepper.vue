<script lang="ts" setup>
const form = reactive({
  sourceColor: '',
  prominentColors: {},
  seedColors: {}
})

const stepper = useStepper({
  'choose-an-image': {
    title: 'Choose an image',
    isValid: () => true
  },
  'set-max-colors': {
    title: 'Set max colors',
    isValid: () => true
  },
  'select-source': {
    title: 'Select source',
    isValid: () => true
  }
})

// (select-source, choose-an-image) -> set-max-colors -> select-seed-colors

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
      <div v-for="(step, id, i) in stepper.steps.value" :key="id">
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
          <div v-if="stepper.isCurrent('select-source')">
            <p>Select a source</p>
            <button>
              <span>Upload</span>
            </button>
            <button>
              <span>URL</span>
            </button>
            <button>
              <span>Color</span>
            </button>
          </div>

          <div v-if="stepper.isCurrent('select-seed-colors')"></div>
        </div>

        <div class="flex gap-4">
          <button v-if="!stepper.isFirst.value" @click="stepper.goToPrevious()">
            Previous
          </button>
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
