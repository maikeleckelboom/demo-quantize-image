<script lang="ts" setup>
import { steps } from '~/workers/quantize/future/worker'
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
  steps.map((step) => ({
    ...step,
    done: false,
    open: false
  }))
)

function isCurrentProcess(index: number) {
  return index === processes.value.findIndex((process) => !process.done)
}

function isPastProcess(index: number) {
  return index < processes.value.findIndex((process) => !process.done)
}

const isLoading = ref<boolean>(true)

const router = useRouter()

const route = useRoute()

const colorStore = useColorsStore()

const { prominentColors, seedColors } = storeToRefs(colorStore)

const errors = ref<unknown>(null)

const quantizeWorker = ref<QuantizeWorker | null>(null)

onBeforeMount(async () => {
  quantizeWorker.value = new Worker(new URL('~/workers/quantize/future/worker.ts', import.meta.url), {
    type: 'module'
  })
})

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
    console.log('Received event', event.data)

    if (isProgressEvent(event)) {
      processes.value[event.data.step - 1].done = true
    }

    if (isDoneEvent(event)) {
      prominentColors.value = event.data.prominentColors
      seedColors.value = event.data.suitableColors
      processes.value[processes.value.length - 1].done = true
      isLoading.value = false
    }

    if (isErrorEvent(event)) {
      errors.value = event.data.error
      isLoading.value = false
    }
  }
})

onUnmounted(() => {
  store.reset()
  colorStore.reset()
  quantizeWorker.value?.terminate()
})

function onCustomize() {
  console.log('Customize')
}

async function onNavigateBack() {
  if (!document.startViewTransition) {
    navigateTo('/quantize')
    return
  }

  const transition = document.startViewTransition(async () => {
    await nextTick()
    navigateTo('/quantize')
  })

  await transition.ready
  await transition.finished
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
      <div class="p-4">
        <div
          v-for="(process, index) in processes"
          :key="index"
          class="grid grid-cols-[28px,1fr] items-center"
        >
          <div class="flex items-start self-start py-2.5">
            <Spinner v-if="isCurrentProcess(index)" class="size-4" />
            <Icon v-else-if="process.done" class="size-5 text-primary" name="ic:check" />
            <Icon v-else class="size-5" name="ic:outline-circle" />
          </div>
          <div class="relative flex flex-col">
            <div
              :class="[
                isPastProcess(index) ? 'text-on-surface-variant/50' : 'text-on-surface',
                {
                  'animate-pulse': isCurrentProcess(index)
                }
              ]"
              class="relative flex w-full items-center justify-between"
            >
              <p class="text-body-md">
                {{ process.name }}
              </p>
              <button class="p-2" @click="process.open = !process.open">
                <Icon v-if="process.open" class="size-5" name="ic:round-unfold-less" />
                <Icon v-else class="size-5" name="ic:round-unfold-more" />
              </button>
            </div>

            <div v-if="process.open" class="right-0 top-0">
              <p class="text-body-sm text-on-surface-variant">
                {{ process.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="prominentColors?.size" class="mb-8 px-4">
        <h2 class="mb-4 text-xl">Prominent Colors</h2>
        <div class="flex flex-row flex-wrap gap-3">
          <div
            v-for="[color] in prominentColors"
            :key="color"
            :style="{ backgroundColor: hexFromArgb(color) }"
            class="min-h-16 min-w-16 rounded-md"
          />
        </div>
      </div>

      <div v-if="seedColors?.length" class="px-4">
        <h2 class="mb-4 text-xl">Suitable Colors</h2>
        <div class="flex flex-row flex-nowrap gap-x-3">
          <div
            v-for="color in seedColors"
            :key="color"
            :style="{ backgroundColor: hexFromArgb(color) }"
            class="min-h-16 min-w-16 rounded-md"
          />
        </div>
      </div>

      <template #footer>
        <div class="grid w-full grid-cols-2 gap-x-2 px-4 md:gap-x-4">
          <Button
            v-if="isLoading"
            class="col-span-2 w-full rounded-full bg-error font-semibold text-on-error"
            intent="none"
            @click="onNavigateBack"
          >
            <Icon class="size-5" name="ic:outline-close" />
            Abort
          </Button>
          <template v-else>
            <Button intent="text" stretch="true" @click="onNavigateBack">Reset</Button>
            <Button stretch="true" @click="onCustomize"> Continue</Button>
          </template>
        </div>
      </template>
    </DialogComponent>
  </div>
</template>
