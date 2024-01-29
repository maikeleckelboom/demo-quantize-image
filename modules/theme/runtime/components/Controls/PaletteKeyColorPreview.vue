<script lang="ts" setup>
import { hexFromArgb, rgbaFromArgb, type TonalPalette } from '@material/material-color-utilities'
import chroma, { type Color, type ColorSpaces } from 'chroma-js'
import SaveToClipboard from '~/modules/theme/runtime/components/SaveToClipboard.vue'

const props = defineProps<{
  palette: TonalPalette
}>()

const { palette } = toRefs(props)

const keyColor = computed(() => {
  return palette.value.keyColor
})

const keyColorHex = computed(() => {
  if (!keyColor.value) return ''
  return hexFromArgb(keyColor.value.toInt())
})

const keyColorRgba = computed(() => {
  if (!keyColor.value) return ''
  return rgbaFromArgb(keyColor.value.toInt())
})

const keyColorHsl = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).hsl()
})

const keyColorLab = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).lab()
})

const keyColorLch = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).lch()
})

const keyColorRgb = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).rgb()
})

const keyColorHsv = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).hsv()
})

const keyColorHsi = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).hsi()
})

const keyColorCmyk = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).cmyk()
})

const keyColorTemperature = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).temperature()
})

const keyColorLuminance = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).luminance()
})

const keyColorAlpha = computed(() => {
  if (!keyColor.value) return ''
  return chroma(hexFromArgb(keyColor.value.toInt())).alpha()
})

const keyColorName = computed(() => {
  if (!keyColor.value) return
  const name = chroma(hexFromArgb(keyColor.value.toInt())).name()
  if (name.startsWith('#')) return
  return name
})

function interpolateColor(color: Color, colorSpace: keyof ColorSpaces) {
  return chroma.interpolate(color, colorSpace)
}

function inlineString(value: unknown) {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return roundNumber(value).toString()
  if (isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') return item
        if (typeof item === 'number') return roundNumber(item).toString()
        return ''
      })
      .join(', ')
  }
  return ''
}

const paletteKeyColorContext = computed(() => {
  return {
    formats: {
      hex: {
        text: inlineString(keyColorHex.value),
        value: keyColorHex.value
      },
      rgb: {
        text: inlineString(keyColorRgb.value),
        value: keyColorRgb.value
      },
      hsl: {
        text: inlineString(keyColorHsl.value),
        value: keyColorHsl.value
      },
      hsv: {
        text: inlineString(keyColorHsv.value),
        value: keyColorHsv.value
      },
      hsi: {
        text: inlineString(keyColorHsi.value),
        value: keyColorHsi.value
      },
      lab: {
        text: inlineString(keyColorLab.value),
        value: keyColorLab.value
      },
      lch: {
        text: inlineString(keyColorLch.value),
        value: keyColorLch.value
      },
      cmyk: {
        text: inlineString(keyColorCmyk.value),
        value: keyColorCmyk.value
      }
    },
    params: {
      temperature: {
        value: keyColorTemperature.value,
        text: keyColorTemperature.value,
        readonly: true
      },
      luminance: {
        value: keyColorLuminance.value,
        text: keyColorLuminance.value,
        readonly: true
      },
      alpha: {
        value: keyColorAlpha.value,
        text: keyColorAlpha.value,
        readonly: true
      }
    }
  }
})

const COLOR_SPACES: (keyof ColorSpaces | 'hex')[] = [
  'hex',
  'rgb',
  'hsl',
  'hsv',
  'hsi',
  'lab',
  'lch',
  'cmyk'
] as const

function isColorSpace(value: unknown): value is keyof ColorSpaces {
  return (
    typeof value === 'string' &&
    COLOR_SPACES.includes(value as keyof ColorSpaces)
  )
}
</script>

<template>
  <div class="relative flex size-full flex-col">
    <output
      :style="{ backgroundColor: keyColorHex }"
      class="aspect-video size-full rounded-md"
    />
    <details>
      <summary class="p-2">Formats</summary>
      <div
        class="scrollbar inset-0 space-y-1 divide-y divide-outline-variant/40 overflow-y-auto px-4"
      >
        <div
          v-for="(color, key) in paletteKeyColorContext.formats"
          :key="key"
          class="group grid grid-cols-[0.5fr,1fr] items-center pt-2"
        >
          <label class="text-label-lg capitalize leading-loose text-outline">
            <span v-if="isColorSpace(key)" class="uppercase">{{ key }}</span>
            <span v-else>{{ key }}</span>
          </label>
          <div
            :class="{ uppercase: key === 'hex' }"
            class="grid grid-cols-[1fr,auto]"
          >
            <div class="p-1 tabular-nums leading-loose tracking-wide">
              {{ color.text }}
            </div>
            <SaveToClipboard
              :source="color.value"
              class="invisible text-end group-hover:visible [&[data-copied=true]]:visible"
            />
          </div>
        </div>
      </div>
    </details>
  </div>
</template>
