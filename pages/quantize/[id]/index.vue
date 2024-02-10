<script lang="ts" setup>
import {
  isDoneData,
  isProgressData,
  processes as processesList,
  type QuantizeWorker,
  type WorkerData
} from '~/workers/quantizeWorker'
import { hexFromArgb } from '@material/material-color-utilities'

definePageMeta({
  title: 'Quantize',
  description: 'Quantize an image to find prominent colors and seed colors',
  middleware: (ctx) => {
    if (!ctx.query.maxColors) {
      navigateTo('/quantize')
    }
  }
})

const store = useFilesStore()

const { selectedFile } = storeToRefs(store)

if (!store.fileObjectUrl || !selectedFile) {
  navigateTo('/quantize')
}

onUnmounted(() => {
  store.reset()
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

const isLoading = ref<boolean>(false)

const router = useRouter()
const route = useRoute()

const colorStore = useColorsStore()

const { prominentColors, seedColors } = storeToRefs(colorStore)

await callOnce(async () => {
  if (!selectedFile.value) {
    return
  }

  isLoading.value = true

  const worker: QuantizeWorker = new Worker(
    new URL('~/workers/quantizeWorker.ts', import.meta.url),
    {
      type: 'module'
    }
  )

  worker.postMessage({
    type: 'start',
    maxColors: Number(route.query.maxColors),
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

async function navigateToNext() {
  await navigateTo({ path: `/quantize/${selectedFile.value!.name}/colors` })
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
              {{ process.task }}
            </p>
          </div>
        </div>
      </div>
      <!--
            <div class="my-8 hidden">
              <div class="flex flex-wrap gap-4">
                <template v-for="[color, count] in prominentColors" :key="color">
                  <Tooltip>
                    <div
                      :style="{ backgroundColor: hexFromArgb(color) }"
                      class="size-12 rounded-md"
                    ></div>
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
      -->
      <div class="my-8">
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
          <Button variant="error" @click="router.back()">Abort Process</Button>
        </div>
        <div v-else class="grid grid-cols-2 gap-x-2 md:gap-x-4">
          <Button :stretch="true" intent="text" @click="router.back()">Reset</Button>
          <Button :stretch="true" @click="navigateToNext"> Customize</Button>
        </div>
      </template>
    </DialogComponent>
  </div>
</template>
