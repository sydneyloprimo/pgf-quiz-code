import resolveConfig from 'tailwindcss/resolveConfig'

import tailwindConfig from '@/tailwind.config.js'

const fullConfig = resolveConfig(tailwindConfig) as any

export const MediaQuery = {
  desktop: `(min-width: ${fullConfig.theme.screens.md})`,
  mobile: `(max-width: ${fullConfig.theme.screens.md})`,
}

// fullConfig.theme.screens.md value is 768px
export const MOBILE_WIDTH = 768

export const instagramUrl = 'https://www.instagram.com/rootstrap'

export const linkedinUrl = 'https://www.linkedin.com/company/rootstrap-it'
