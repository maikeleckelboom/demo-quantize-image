<script lang="ts" setup>
import type { Track } from '~/types'

const tracks = shallowRef<Track[]>([
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
  <div class="flex flex-col gap-4">
    <SoundTrack v-for="track in tracks" :key="track.id" :track="track" />
  </div>
</template>

<style scoped>

</style>
