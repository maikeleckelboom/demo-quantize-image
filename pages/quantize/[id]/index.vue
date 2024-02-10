<script lang="ts" setup>
import { steps } from '~/workers/quantize/worker'
import { hexFromArgb } from '@material/material-color-utilities'
import {
  isDoneEvent,
  isErrorEvent,
  isProgressEvent,
  type QuantizeWorker,
  type StartEventData,
  type WorkerEventData
} from '~/workers/quantize/types'

definePageMeta({
  title: 'Quantize',
  description: 'Quantize an image to find prominent colors and seed colors'
})

const store = useFilesStore()

const { selectedFile } = storeToRefs(store)

if (!store.fileObjectUrl || !selectedFile) {
  navigateTo('/quantize')
}

const processes = ref(
  steps.map((step, index) => ({
    index,
    step,
    done: false
  }))
)

function isCurrentProcess(index: number) {
  return index === processes.value.findIndex((process) => !process.done)
}

function isPastProcess(index: number) {
  return index < processes.value.findIndex((process) => !process.done)
}

const isLoading = ref<boolean>(false)

const router = useRouter()
const route = useRoute()

const colorStore = useColorsStore()
const { prominentColors, seedColors } = storeToRefs(colorStore)

const errors = ref<unknown>(null)

const quantizeWorker = ref<QuantizeWorker | null>(null)

whenever(quantizeWorker, (worker) => {
  if (!selectedFile.value) return

  isLoading.value = true

  const startMessage: StartEventData = {
    type: 'start',
    maxColors: Number(route.query.maxColors),
    file: selectedFile.value
  }

  worker.postMessage(startMessage)

  worker.onmessage = (event: MessageEvent<WorkerEventData>) => {
    if (isProgressEvent(event)) {
      processes.value[event.data.step - 1].done = true
    }

    if (isDoneEvent(event)) {
      prominentColors.value = event.data.prominentColors
      seedColors.value = event.data.suitableColors
      isLoading.value = false
    }

    if (isErrorEvent(event)) {
      errors.value = event.data.error
      isLoading.value = false
    }
  }
})

onMounted(() => {
  quantizeWorker.value = new Worker(new URL('~/workers/worker.ts', import.meta.url), {
    type: 'module'
  })
})

onUnmounted(() => {
  store.reset()
  colorStore.reset()
  quantizeWorker.value?.terminate()
})

function onCustomize() {
  console.log('Customize')
}
</script>
<template>
  <div class="mx-auto w-full max-w-xl p-4">
    <DialogComponent>
      <template #breakout>
        <div class="relative flex size-full rounded-md md:pt-4">
          <NuxtImg
            :src="store.fileObjectUrl"
            alt=""
            class="selected size-full max-h-[320px] rounded-b-lg object-cover"
          />
        </div>
      </template>
      <div class="">
        <div
          v-for="process in processes"
          :key="process.index"
          class="grid h-[30px] grid-cols-[28px,1fr] items-center"
        >
          <div class="grid items-center">
            <Spinner v-if="isCurrentProcess(process.index)" class="size-5" />
            <Icon v-else-if="process.done" class="size-5 text-primary" name="ic:check" />
            <Icon v-else class="size-5" name="ic:outline-circle" />
          </div>
          <div class="relative flex w-fit flex-col">
            <p
              :class="[
                isPastProcess(process.index) ? 'text-on-surface-variant/50' : 'text-on-surface',
                {
                  'animate-pulse': isCurrentProcess(process.index)
                }
              ]"
              class="relative w-fit text-body-md"
            >
              {{ process.step }}
            </p>
          </div>
        </div>
      </div>
      <div v-if="seedColors?.length" class="my-8">
        <h2 class="mb-4 text-xl">Suitable Colors (1-5)</h2>
        <div class="flex flex-row flex-nowrap gap-x-3">
          <div
            v-for="color in seedColors"
            :key="color"
            :style="{ backgroundColor: hexFromArgb(color) }"
            class="min-h-16 min-w-16 rounded-md"
          ></div>
        </div>
      </div>

      <template #footer>
        <div v-if="isLoading" class="flex justify-end">
          <Button variant="error" @click="router.back()">Abort</Button>
        </div>
        <div v-else class="grid grid-cols-2 gap-x-2 md:gap-x-4">
          <Button :stretch="true" intent="text" @click="router.back()">Reset</Button>
          <Button :stretch="true" @click="onCustomize"> Continue</Button>
        </div>
      </template>
    </DialogComponent>
  </div>
</template>
