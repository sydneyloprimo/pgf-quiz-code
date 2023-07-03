import resolveConfig from 'tailwindcss/resolveConfig'

import tailwindConfig from '@/tailwind.config.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fullConfig = resolveConfig(tailwindConfig) as any

export const MediaQuery = {
  desktop: `(min-width: ${fullConfig.theme.screens.md})`,
  mobile: `(max-width: ${fullConfig.theme.screens.md})`,
}
