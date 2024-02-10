<script lang="ts" setup>
import {
  isDoneData,
  isProgressData,
  processes as processesList,
  type QuantizeWorker,
  type WorkerData
} from '~/workers/quantizeWorker'
import { hexFromArgb } from '@material/material-color-utilities'

const { Escape } = useMagicKeys()
const router = useRouter()
whenever(Escape, () => router.back())

const store = useFilesStore()
const { selectedFile } = storeToRefs(store)

onUnmounted(() => {
  store.reset()
})

if (!store.fileObjectUrl || !selectedFile) {
  navigateTo('/quantize')
}

definePageMeta({
  title: 'Quantize',
  description: 'Quantize an image to find prominent colors and seed colors',
  middleware: (ctx) => {
    if (!ctx.params.id || !ctx.query.maxColors) {
      navigateTo('/quantize')
    }
  }
})

const processes = ref(
  processesList.map((task, index) => ({
    index,
    task,
    done: false
  }))
)

function isCurrentProcess(index: number) {
  return index === processes.value.findIndex((process) => !process.done)
}

function isPastProcess(index: number) {
  return index < processes.value.findIndex((process) => !process.done)
}

const prominentColors = ref<Map<number, number>>()
const seedColors = ref<number[]>([])
const isLoading = ref<boolean>(false)

onMounted(() => {
  if (!selectedFile.value) {
    return
  }

  isLoading.value = true

  const worker: QuantizeWorker = new Worker(new URL('~/workers/quantizeWorker.ts', import.meta.url), {
    type: 'module'
  })

  worker.postMessage({
    type: 'start',
    maxColors: 128,
    file: selectedFile.value
  })

  worker.addEventListener('message', (evt: MessageEvent<WorkerData>) => {
    if (isProgressData(evt.data)) {
      processes.value[evt.data.step - 1].done = true
    }

    if (isDoneData(evt.data)) {
      prominentColors.value = evt.data.prominentColors
      seedColors.value = evt.data.seedColors

      worker.terminate()
      isLoading.value = false
    }
  })
})
</script>
<template>
  <div class="mx-auto w-full max-w-xl p-4">
    <DialogComponent>
      <NuxtImg :src="store.fileObjectUrl" alt="" class="selected w-auto rounded-md object-cover" />
      <div class="my-8">
        <div
          v-for="process in processes"
          :key="process.index"
          class="grid h-[30px] grid-cols-[28px,1fr] items-center"
        >
          <div class="grid items-center">
            <Spinner v-if="isCurrentProcess(process.index)" class="size-5" />
            <Icon v-else-if="process.done" class="size-5 text-primary" name="ic:check" />
            <Icon v-else class="size-6" name="ic:outline-circle" />
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
              {{ process.task }}
            </p>
          </div>
        </div>
      </div>
      <div class="my-8">
        <div class="flex flex-wrap gap-4">
          <template v-for="[color, count] in prominentColors" :key="color">
            <Tooltip>
              <div :style="{ backgroundColor: hexFromArgb(color) }" class="size-12 rounded-md"></div>
              <template #content>
                <div class="flex flex-col">
                  <p class="uppercase">{{ hexFromArgb(color) }}</p>
                  <p class="tabular-nums">count: {{ count }}</p>
                </div>
              </template>
            </Tooltip>
          </template>
        </div>
      </div>
      <div class="my-8">
        <div class="grid grid-cols-4 gap-4">
          <div
            v-for="color in seedColors"
            :key="color"
            :style="{ backgroundColor: hexFromArgb(color) }"
            class="h-16 w-16 rounded-md"
          ></div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <Button v-if="isLoading" variant="error" @click="router.back()"> Abort Process</Button>
          <Button v-else @click="router.back()">Close</Button>
        </div>
      </template>
    </DialogComponent>
  </div>
</template>
