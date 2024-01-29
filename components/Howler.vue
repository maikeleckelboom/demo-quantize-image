<script lang="ts" setup>
import { Howl } from 'howler'

const samplesDir = '/sound/samples' as const

const sampleFilenames = [
  'boom-bap-drums_94bpm.wav',
  'distorted-house_128bpm.wav'
]

const samplePaths = sampleFilenames.map(
  (filename) => `${samplesDir}/${filename}`
)

const samples = computed(() =>
  samplePaths.map(
    (path) =>
      new Howl({
        src: path
      })
  )
)

const playSample = (index: number) => {
  samples.value[index].play()
}

const stopSample = (index: number) => {
  samples.value[index].stop()
}

const pauseSample = (index: number) => {
  samples.value[index].pause()
}
</script>

<template>
  <ul class="flex flex-col p-4">
    <li
      v-for="(sample, index) in samples"
      :key="index"
      class="size-fit rounded border border-outline p-2"
    >
      <span class="text-secondary">{{ sampleFilenames[index] }}</span>
      <template v-if="sample.playing()">
        <button
          class="rounded-full border-thin border-transparent"
          @click="pauseSample(index)"
        >
          <Icon class="size-10" name="ic:round-pause-circle" />
        </button>
      </template>
      <template v-else>
        <button
          class="rounded-full border-thin border-transparent"
          @click="playSample(index)"
        >
          <Icon class="size-10" name="ic:round-play-circle" />
        </button>
      </template>
      <button
        class="rounded-full border-thin border-transparent"
        @click="stopSample(index)"
      >
        <Icon class="size-10" name="ic:round-stop-circle" />
      </button>
    </li>
  </ul>
</template>

<style scoped></style>
