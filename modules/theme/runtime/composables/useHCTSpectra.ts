import chroma from 'chroma-js'
import { Hct, hexFromArgb } from '@material/material-color-utilities'

type FormModelHct = {
  hue: number
  chroma: number
  tone: number
}

type FormModelBounds = {
  [K in keyof FormModelHct]: {
    min: number
    max: number
    default: number
    value: number
  }
}

export function useHCTSpectra(gradientType: 'conic' | 'linear' = 'linear') {
  const { $dynamicScheme } = useNuxtApp()

  const hctColor = computed(() => {
    const primaryPalette = $dynamicScheme.value.primaryPalette
    return primaryPalette.keyColor
  })

  const formModel = reactive<FormModelBounds>({
    hue: { min: 0, max: 360, default: 0, value: hctColor.value.hue },
    chroma: { min: 0, max: 150, default: 150, value: hctColor.value.chroma },
    tone: { min: 0, max: 100, default: 60, value: hctColor.value.tone }
  })

  watch(
    hctColor,
    (hct) => {
      formModel.hue.value = hct.hue
      formModel.chroma.value = hct.chroma
      formModel.tone.value = hct.tone
    },
    { deep: true }
  )

  const getHueColors = () => [
    hexFromArgb(
      Hct.from(
        formModel.hue.min,
        formModel.chroma.default,
        formModel.tone.default
      ).toInt()
    ),
    hexFromArgb(
      Hct.from(
        formModel.hue.max * 0.25,
        formModel.chroma.default,
        formModel.tone.default
      ).toInt()
    ),
    hexFromArgb(
      Hct.from(
        formModel.hue.max * 0.5,
        formModel.chroma.default,
        formModel.tone.default
      ).toInt()
    ),
    hexFromArgb(
      Hct.from(
        formModel.hue.max * 0.75,
        formModel.chroma.default,
        formModel.tone.default
      ).toInt()
    ),
    hexFromArgb(
      Hct.from(
        formModel.hue.max,
        formModel.chroma.default,
        formModel.tone.default
      ).toInt()
    )
  ]

  const getChromaColors = () => [
    hexFromArgb(
      Hct.from(formModel.hue.value, formModel.chroma.min, formModel.tone.default).toInt()
    ),
    hexFromArgb(
      Hct.from(
        formModel.hue.value,
        formModel.chroma.max * 0.25,
        formModel.tone.default
      ).toInt()
    ),
    hexFromArgb(
      Hct.from(
        formModel.hue.value,
        formModel.chroma.max * 0.5,
        formModel.tone.default
      ).toInt()
    ),
    hexFromArgb(
      Hct.from(
        formModel.hue.value,
        formModel.chroma.max * 0.75,
        formModel.tone.default
      ).toInt()
    ),
    hexFromArgb(
      Hct.from(formModel.hue.value, formModel.chroma.max, formModel.tone.default).toInt()
    )
  ]

  const getToneColors = () => [
    hexFromArgb(
      Hct.from(formModel.hue.value, formModel.chroma.min, formModel.tone.min).toInt()
    ),
    hexFromArgb(
      Hct.from(
        formModel.hue.value,
        formModel.chroma.min,
        formModel.tone.max * 0.25
      ).toInt()
    ),
    hexFromArgb(
      Hct.from(
        formModel.hue.value,
        formModel.chroma.min,
        formModel.tone.max * 0.5
      ).toInt()
    ),
    hexFromArgb(
      Hct.from(
        formModel.hue.value,
        formModel.chroma.min,
        formModel.tone.max * 0.75
      ).toInt()
    ),
    hexFromArgb(
      Hct.from(formModel.hue.value, formModel.chroma.min, formModel.tone.max).toInt()
    )
  ]

  const gradientMap = {
    conic: (colors: string) => `conic-gradient(from 0deg, ${colors})`,
    linear: (colors: string) => `linear-gradient(to right, ${colors})`,
    square: (colors: string) => `linear-gradient(to right top, ${colors})`
  }

  return {
    hue: computed(() => ({
      background: gradientMap[gradientType](
        chroma.scale(getHueColors()).mode('lab').colors(formModel.hue.max).join(', ')
      )
    })),
    chroma: computed(() => ({
      background: gradientMap[gradientType](
        chroma
          .scale(getChromaColors())
          .mode('lab')
          .colors(formModel.chroma.max)
          .join(', ')
      )
    })),
    tone: computed(() => ({
      background: gradientMap[gradientType](
        chroma.scale(getToneColors()).mode('lab').colors(formModel.tone.max).join(', ')
      )
    }))
  }
}
