<script lang="ts" setup>
import { isDoneData, isProgressData, type QuantizeWorker, type WorkerData } from '~/workers/quantizeWorker'
import { hexFromArgb } from '@material/material-color-utilities'

const { Escape } = useMagicKeys()
const router = useRouter()
whenever(Escape, () => router.back())

onUnmounted(() => {
  store.reset()
})

const store = useFilesStore()
const { selectedFile } = storeToRefs(store)

if (!store.fileObjectUrl || !selectedFile) {
  navigateTo('/')
}

definePageMeta({
  title: 'Quantize',
  description: 'Quantize an image to find prominent colors and seed colors',
  middleware: (ctx) => {
    if (!ctx.params.id || !ctx.query.maxColors) {
      navigateTo('/')
    }
  }
})

const processesList = [
  'Create an image from the file',
  'Draw the image onto a canvas',
  'Get image data from the canvas',
  'Convert image data to bytes',
  'Decode bytes into pixels',
  'Quantize pixels to find prominent colors',
  'Score prominent colors to obtain seed colors'
]

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
const isLoading = ref<boolean>(true)
const progress = ref<number>(0)

onMounted(() => {
  if (!selectedFile.value) {
    return
  }

  const worker: QuantizeWorker = new Worker(new URL('~/workers/quantizeWorker.ts', import.meta.url), {
    type: 'module'
  })

  worker.postMessage({
    type: 'init',
    maxColors: 128,
    file: selectedFile.value
  })

  worker.addEventListener('message', (evt: MessageEvent<WorkerData>) => {
    if (isProgressData(evt.data)) {
      processes.value[evt.data.step - 1].done = true
      progress.value = evt.data.progress
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
      <NuxtImg :src="store.fileObjectUrl" alt="" class="selected h-fit w-auto rounded-md object-cover" />
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
              :class="isPastProcess(process.index) ? 'text-on-surface-variant' : 'text-on-surface'"
              class="relative w-fit text-body-md"
            >
              {{ process.task }}
            </p>
          </div>
        </div>
      </div>
      <div class="my-8">
        <div class="flex flex-wrap gap-4">
          <div
            v-for="[color] in prominentColors"
            :key="color"
            :style="{ backgroundColor: hexFromArgb(color) }"
            class="size-12 rounded-md"
          />
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
          <Button v-if="isLoading" class="bg-error-container text-on-error-container" @click="router.back()">
            Abort Process
          </Button>
          <Button v-else @click="router.back()">Close</Button>
        </div>
      </template>
    </DialogComponent>
  </div>
</template>

<style>
.box-target {
  view-transition-name: target;
}

/*
::view-transition-old(root) {

}

::view-transition-new(root) {
}*/
</style>
