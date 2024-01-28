export type TrackControls = {
  volume: boolean
  mute: boolean
  playPause: boolean
  stop: boolean
}

export type Track = {
  id: string
  name: string
  src: string
  controls: TrackControls
}

export type Playlist = {
  id: string
  name: string
  tracks: Track[]
}

export type TrackContext = {
  playing: boolean
  muted: boolean
  volume: number
  currentTime: number
  duration: number
  timesPlayed: number
}
