<script lang="ts" setup>
import type { Track } from '~/types'

const houseTrack = shallowRef<Track[]>([
  {
    id: '1',
    name: 'James Hype - Drums',
    src: '/sound/tracks/james-hype-drums.mp3',
    controls: {
      volume: true,
      mute: true,
      playPause: true,
      stop: true
    }
  },
  {
    id: '3',
    name: 'Mau P - Dress Code (Original Mix)',
    src: '/sound/tracks/mau_p-dress_code.mp3',
    controls: {
      volume: true,
      mute: true,
      playPause: true,
      stop: true
    }
  }
])
</script>

<template>
  <div class="flex-col w-svw mx-auto flex justify-center items-center h-svh max-w-full">
    <div class="flex flex-col">
      <template v-for="track in houseTrack" :key="track.id">
        <ClientOnly>
          <div class="size-full" data-pending-placeholder />
          <SoundTrack :id="track.id" :key="track.id" :controls="track.controls" :name="track.name" :src="track.src" />
        </ClientOnly>
      </template>
    </div>
  </div>
</template>

<style lang="postcss">

</style>
