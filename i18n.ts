import { getRequestConfig } from 'next-intl/server'

import {
  FEATURE_FLAG_LAMB,
  FEATURE_FLAG_PANCREATIC,
  FEATURE_FLAG_WAITLIST,
} from '@/constants'
import {
  getContentfulCopyMap,
  mergeContentfulIntoMessages,
} from '@/contentful/copy'
import { getFeatureFlag } from '@/contentful/featureFlags'

export enum Locale {
  EN = 'en',
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale

  if (!locale || locale !== Locale.EN) {
    throw new Error(`Invalid locale: ${locale}`)
  }

  const messages = (await import(`./messages/${locale}.json`))
    .default as Record<string, unknown>
  const [contentfulCopy, waitlistFlipEnabled, lambEnabled, pancreaticEnabled] =
    await Promise.all([
      getContentfulCopyMap(locale),
      getFeatureFlag(FEATURE_FLAG_WAITLIST),
      getFeatureFlag(FEATURE_FLAG_LAMB),
      getFeatureFlag(FEATURE_FLAG_PANCREATIC),
    ])
  const merged =
    Object.keys(contentfulCopy).length > 0
      ? mergeContentfulIntoMessages(messages, contentfulCopy)
      : { ...messages }
  ;(merged as Record<string, unknown>).FeatureFlags = {
    LambEnabled: lambEnabled,
    PancreaticEnabled: pancreaticEnabled,
    waitlistFlip: waitlistFlipEnabled,
  }

  return {
    locale,
    messages: merged,
  }
})
