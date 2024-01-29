import type { Config } from 'tailwindcss'

import { materialThemePreset } from './modules/theme/tailwind.preset'

const srcDir: string = '.' as const

const config = {
  content: [
    `${srcDir}/modules/**/runtime/*.{js,ts,vue}`,
    `${srcDir}/modules/**/runtime/components/**/*.{js,ts,vue}`,
    `${srcDir}/modules/**/runtime/layouts/**/*.{js,ts,vue}`,
    `${srcDir}/modules/**/runtime/pages/**/*.{js,ts,vue}`
  ],
  presets: [materialThemePreset],
  theme: {}
} satisfies Config

export default config
