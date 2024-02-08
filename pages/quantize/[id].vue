<script lang="ts" setup>
import { hexFromArgb } from '@material/material-color-utilities'
import { isDoneData, isProgressData, type QuantizeWorker, type WorkerData } from '~/workers/quantize.worker'

const store = useFilesStore()
const { selectedFile, fileObjectUrl } = storeToRefs(store)

if (!selectedFile.value) {
  navigateTo('/image')
}

const processesList = [
  'Create an image from the file',
  'Draw the image onto a canvas',
  'Get image data from the canvas',
  'Convert image data to bytes',
  'Decode bytes into pixels',
  'Quantize pixels to find prominent colors',
  'Score prominent colors to obtain seed colors'
]

function scaleProgress(step: number) {
  return Math.round((step / processesList.length) * 100)
}

const processes = ref(
  processesList.map((task, index) => ({
    index,
    task,
    done: false
  }))
)

const prominentColors = ref<Map<number, number>>()
const seedColors = ref<number[]>([])
const isLoading = ref<boolean>(true)
const currentProgress = ref<number>(0)

onMounted(() => {
  const worker: QuantizeWorker = new Worker(new URL('~/workers/quantize.worker.ts', import.meta.url), {
    type: 'module'
  })

  worker.postMessage({
    type: 'init',
    maxColors: maxColors.value,
    file: selectedFile.value!
  })

  worker.addEventListener('message', (evt: MessageEvent<WorkerData>) => {
    if (isProgressData(evt.data)) {
      processes.value[evt.data.step - 1].done = true
      currentProgress.value = evt.data.progress
    }
    if (isDoneData(evt.data)) {
      prominentColors.value = evt.data.colors.prominent
      seedColors.value = evt.data.colors.seed
      isLoading.value = false
      worker.terminate()
    }
  })
})

const maxColors = ref<number>(128)

function setDone(index: number) {
  processes.value[index].done = true
}

const { Escape } = useMagicKeys()

const router = useRouter()
whenever(Escape, () => router.back())

onUnmounted(() => {
  store.reset()
})

function isCurrentProcess(index: number) {
  return index === processes.value.findIndex((process) => !process.done)
}

function isPastProcess(index: number) {
  return index < processes.value.findIndex((process) => !process.done)
}
</script>
<template>
  <div class="mx-auto w-full max-w-xl p-4">
    <DialogComponent>
      <img
        id="vt-source-element"
        :src="fileObjectUrl"
        alt="Quantized Image"
        class="h-fit w-auto rounded-md object-cover"
      />
      <div class="my-8">
        <div
          v-for="process in processes"
          :key="process.index"
          class="grid h-[30px] grid-cols-[28px,1fr] items-center"
          @click="setDone(process.index)"
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
            v-for="[color, count] in prominentColors"
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

<style scoped>
#vt-source-element {
  view-transition-name: source-img;
}

::view-transition-old(source-img),
::view-transition-new(source-img) {
}

::view-transition-image-pair(source-img) {
  transition: ease all 200ms;
}

/*
::view-transition-old(root) {

}

::view-transition-new(root) {
}*/
</style>
