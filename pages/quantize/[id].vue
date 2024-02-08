<script lang="ts" setup>
import { hexFromArgb } from '@material/material-color-utilities'

const store = useFilesStore()
const { selectedFile } = storeToRefs(store)
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

const processes = ref(
  processesList.map((task, index) => ({
    index,
    task,
    done: false
  }))
)

const prominentColors = ref<Map<number, number>>([])
const seedColors = ref<number[]>([])
onMounted(() => {
  const worker = new Worker(new URL('~/workers/quantize.worker.ts', import.meta.url), {
    type: 'module'
  })
  worker.postMessage({ maxColors: maxColors.value, file: selectedFile.value })
  worker.onmessage = (event) => {
    if (event.data.type === 'prominentColors') {
      prominentColors.value = event.data.colors
      setDone(5)
    }

    if (event.data.type === 'done') {
      seedColors.value = event.data.colors
      setDone(6)
    }
  }
})

const maxColors = ref<number>(128)

function setDone(index: number) {
  processes.value[index].done = true
}

const { Escape } = useMagicKeys()

const router = useRouter()
whenever(Escape, () => router.back())

const fileObjectUrl = computed(() => {
  const file = selectedFile.value
  if (!file) return
  return URL.createObjectURL(file)
})
</script>
<template>
  <div class="mx-auto w-full max-w-xl p-4">
    <DialogComponent>
      <img :src="fileObjectUrl" alt="Quantized Image" class="h-fit w-auto rounded-md object-cover" />
      <div class="my-8">
        <div
          v-for="process in processes"
          :key="process.index"
          class="grid h-[30px] grid-cols-[38px,1fr] items-center"
          @click="setDone(process.index)"
        >
          <div>
            <Icon v-if="process.done" class="size-6 text-primary" name="ic:check" />
            <Icon v-else class="size-6" name="ic:outline-circle" />
          </div>
          <div>
            <p>{{ process.task }}</p>
          </div>
        </div>
      </div>
      <div class="my-8">
        <h2 class="text-headline-md">Prominent Colors</h2>
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
        <h2 class="text-headline-md">Seed Colors</h2>
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
          <Button @click="router.back()"> Abort Process</Button>
        </div>
      </template>
    </DialogComponent>
  </div>
</template>

<style scoped></style>
