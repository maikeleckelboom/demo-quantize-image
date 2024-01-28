<script lang="ts" setup>
import { Howl } from 'howler'

const samplesDir = '/sound/samples' as const

const sampleFilenames = [
  'boom-bap-drums_94bpm.wav',
  'distorted-house_128bpm.wav'
]

const samplePaths = sampleFilenames.map(filename => `${samplesDir}/${filename}`)


const samples = computed(() => samplePaths.map(path => new Howl({
  src: path
})))

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
  <div class="w-full max-w-expanded mx-auto flex justify-center items-center h-svh">
    <ul class="p-4 flex flex-col">
      <li v-for="(sample, index) in samples" :key="index" class="p-2 border border-outline size-fit rounded">
        <span class="text-secondary">{{ sampleFilenames[index] }}</span>
        <!--
                <audio :src="samplePaths[index]" controls></audio>
        -->

        {{ sample.playing() }}
        <template v-if="sample.playing()">
          <button class="border-thin border-transparent rounded-full" @click="pauseSample(index)">
            <Icon class="size-10" name="ic:round-pause-circle" />
          </button>
        </template>
        <template v-else>
          <button class="border-thin border-transparent rounded-full" @click="playSample(index)">
            <Icon class="size-10" name="ic:round-play-circle" />
          </button>
        </template>


        <button class="border-thin border-transparent rounded-full"
                @click="stopSample(index)">
          <Icon class="size-10" name="ic:round-stop-circle" />
        </button>


      </li>
    </ul>
  </div>
</template>

<style lang="postcss">

</style>
