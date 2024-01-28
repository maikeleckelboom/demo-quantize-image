<script lang='ts' setup>
import { type Ref } from 'vue'
import { hexFromArgb } from '@material/material-color-utilities'
import WaveSurfer from 'wavesurfer.js'
import type { TrackContext, TrackControls } from '~/types'

const colorScheme = useSchemeColors()

const props = defineProps<{
  id?: string,
  src: string, name: string, controls?: TrackControls
}>()

const controlToggles = reactive({
  volume: props.controls?.volume ?? true,
  mute: props.controls?.mute ?? true,
  playPause: props.controls?.playPause ?? true,
  stop: props.controls?.stop ?? true
})

const track = shallowRef()
const trackWaves = ref<HTMLElement>()

onMounted(async () => {
  if (!trackWaves.value) return

  const Minimap = (await import('wavesurfer.js/dist/plugin/wavesurfer.minimap.js')).default

  track.value = WaveSurfer.create({
    container: trackWaves.value as HTMLElement,
    waveColor: hexFromArgb(colorScheme.value.primary),
    progressColor: hexFromArgb(colorScheme.value.primaryContainer),
    barWidth: 4,
    barRadius: 2,
    cursorWidth: 2,
    cursorColor: hexFromArgb(colorScheme.value.primaryContainer),
    hideScrollbar: false,
    responsive: true,
    loopSelection: true,
    normalize: true,
    plugins: [
      // Register the plugin
      Minimap.create({
        height: 20,
        waveColor: hexFromArgb(colorScheme.value.tertiary),
        progressColor: hexFromArgb(colorScheme.value.tertiaryContainer)
        
      })
    ]
  })
})

whenever(track, (waveSurfer) => {
  if (!props.src || props.src === '') return
  waveSurfer.load(props.src)
})


const context = reactive<TrackContext>({
  playing: false,
  muted: false,
  volume: 0.2,
  currentTime: 0,
  duration: 0,
  timesPlayed: 0
})

watch(context, (ctx, oldCtx) => {
  console.log('context changed', ctx)

}, { deep: true })

const replay = () => {
  if (!track.value) return
  track.value.seekTo(0)
  context.currentTime = 0
  context.playing = false
  context.timesPlayed++
}

whenever(track, (surfer: WaveSurfer) => {
  surfer.on('seek', (value: number) => {
    context.currentTime = value
  })
  surfer.on('interaction', () => {
    if ('userActivation' in navigator && !navigator.userActivation.hasBeenActive) {
      return
    }

    if (!context.playing) {
      context.playing = true
      surfer.play()
    }

  })
  surfer.on('click', (progress: number) => {
    surfer.seekTo(progress)
  })
  surfer.on('ready', () => {
    context.duration = surfer.getDuration()
    surfer.setVolume(context.volume)
    surfer.zoom(120)
  })
  surfer.on('audioprocess', () => {
    context.currentTime = surfer.getCurrentTime()
  })
  surfer.on('play', () => {
    context.playing = true
  })
  surfer.on('pause', () => {
    context.playing = false
  })
  surfer.on('volume', (value: number) => {
    context.volume = value
  })
  surfer.on('mute', (value: boolean) => {
    context.muted = value
  })
  surfer.on('finish', () => {
    surfer.seekTo(0)
    context.currentTime = 0

    replay()

    context.playing = false
    context.timesPlayed++
  })
})

const onSeek = (progress: number) => {
  if (!track.value) return

  track.value.seekTo(progress)
}

const onStop = () => {
  if (!track.value || !context.playing) return
  context.playing = false

  track.value.stop()
}

const onPlayPause = () => {
  if (!track.value) return

  context.playing = !context.playing
  track.value.playPause()
}


const onVolumeChangeEvent = (event: Event) => {
  const value = (event.target as HTMLInputElement).valueAsNumber
  if (!track.value) return

  track.value.setVolume(value)
  context.volume = value
}

const onVolumeChange = (value: number) => {
  if (!track.value) return

  track.value.setVolume(value)
  context.volume = value
}

const onMute = () => {
  if (!track.value) return
  track.value.toggleMute()
  context.muted = !context.muted
  context.volume = context.muted ? 0 : 0.6
}

watch(() => context.volume, async (volume) => {
  if (!track.value) return

  track.value.setVolume(volume)
  track.value.setMute(volume === 0)

})

const currentElement = useCurrentElement() as Ref<HTMLDivElement>

const { focused } = useFocus(currentElement)

const { enter, space, m, arrowUp, arrowDown, arrowLeft, arrowRight } = useMagicKeys({
  passive: false,
  onEventFired: (ev: KeyboardEvent) => {
    ev.preventDefault()
  }
})

const enterOrSpace = computed(() => enter.value || space.value)

whenever(enterOrSpace, () => {
  if (!focused.value) return
  onPlayPause()
})

whenever(m, () => {
  if (!focused.value) return
  onMute()
})

whenever(arrowUp, () => {
  if (!focused.value) return
  onVolumeChange(context.volume + 0.1)
})

whenever(arrowDown, () => {
  if (!focused.value) return
  onVolumeChange(context.volume - 0.1)
})

whenever(arrowLeft, () => {
  if (!focused.value) return
  const progress = Math.floor(context.currentTime / context.duration * 100) / 100
  const position = progress - 0.05
  const positionProgress = Math.max(0, position)
  onSeek(positionProgress)
})

whenever(arrowRight, () => {
  if (!focused.value) return
  const progress = Math.floor(context.currentTime / context.duration * 100) / 100
  const position = progress + 0.05
  const positionProgress = Math.min(1, position)
  onSeek(positionProgress)
})

const padZero = (value: number) => Math.floor(value).toString().padStart(2, '0')

const durationText = computed(() => {
  const minutes = padZero(context.duration / 60)
  const seconds = padZero(context.duration % 60)
  return `${minutes}:${seconds}`
})

const currentTimeText = computed(() => {
  const minutes = padZero(context.currentTime / 60)
  const seconds = padZero(context.currentTime % 60)
  return `${minutes}:${seconds}`
})
</script>

<template>
  <div
    class='relative flex flex-col w-full min-w-96 my-4 bg-surface-level-1 rounded-md border border-transparent outline-none hover:opacity-100 focus:opacity-100 focus-within:opacity-100 focus-visible:opacity-100'
    tabindex='0'
  >
    <div class='flex justify-between items-center m-2'>
      <p class='text-title-small text-on-surface-variant leading-loose'>
        {{ name }}
      </p>
    </div>

    <!-- full track preview -->


    <slot name='track'>
      <output :id='name' ref='trackWaves' class='  thin-scrollbar' />
    </slot>

    <div class='flex flex-nowrap mt-4 gap-4 bg-surface-level-1 rounded-md  z-10 left-0 bottom-0 right-0'>
      <div v-if='controlToggles' class='flex flex-nowrap items-center gap-2 ml-2'>
        <button class='p-2 rounded-md hover:bg-surface-level-3 hover:disabled:opacity-10 active:bg-surface-level-4'
                @click='onPlayPause'>
          <Icon v-if='context.playing' class='w-7 h-7' name='ic:round-pause' />
          <Icon v-else class='w-7 h-7' name='ic:round-play-arrow' />
        </button>
        <button v-if='controlToggles.stop'
                :aria-disabled='(context.currentTime === context.duration || context.currentTime === 0)'
                class='p-2 rounded-md aria-disabled:opacity-40 hover:bg-surface-level-3 hover:disabled:opacity-10 active:bg-surface-level-4'
                @click='onStop'>
          <Icon class='w-7 h-7' name='ic:round-stop' />
        </button>
        <button
          :aria-disabled='(!context.playing && context.currentTime === context.duration) || context.currentTime === 0'
          class='p-2 rounded-md aria-disabled:opacity-40 hover:bg-surface-level-3 hover:disabled:opacity-10 active:bg-surface-level-4'
          @click='onSeek(0)'>
          <Icon class='w-7 h-7' name='ic:round-replay' />
        </button>
        <button v-if='controlToggles.mute'
                class='p-2 rounded-md hover:bg-surface-level-3 hover:disabled:opacity-10 active:bg-surface-level-4'
                @click='onMute'>
          <Icon v-if='context.muted' class='w-7 h-7' name='ic:round-volume-off' />
          <Icon v-else class='w-7 h-7' name='ic:round-volume-up' />
        </button>
      </div>
      <div class='flex flex-nowrap items-center gap-3 flex-1 ml-2'>
        <ExampleRangeSlider
          v-if='controlToggles.volume'
          v-model='context.volume'
          :aria-valuemax='1'
          :aria-valuemin='0'
          :aria-valuenow="context.volume"
          class='h-14 w-full bg-error flex bottom-0 left-0 right-0 rounded-md accent-primary'
          max='1'
          min='0'
          step='0.1'

          type='range'
          @input='onVolumeChangeEvent'
        />
        <p class='tabular-nums text-on-surface-variant text-label-large w-10 text-end'>
          {{ `${context.volume * 100}%` }}
        </p>
      </div>
      <div class='flex items-center justify-end pr-4'>
        <p class='text-label-medium tabular-nums text-on-surface-variant '>
          {{ currentTimeText }} / {{ durationText }}
        </p>
      </div>
    </div>

  </div>
</template>
