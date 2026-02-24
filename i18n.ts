import { getRequestConfig } from 'next-intl/server'

import { FEATURE_FLAG_WAITLIST } from '@/constants'
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
  const [contentfulCopy, waitlistFlipEnabled] = await Promise.all([
    getContentfulCopyMap(locale),
    getFeatureFlag(FEATURE_FLAG_WAITLIST),
  ])
  const merged =
    Object.keys(contentfulCopy).length > 0
      ? mergeContentfulIntoMessages(messages, contentfulCopy)
      : { ...messages }
  ;(merged as Record<string, unknown>).FeatureFlags = {
    waitlistFlip: waitlistFlipEnabled,
  }

  return {
    locale,
    messages: merged,
  }
})
