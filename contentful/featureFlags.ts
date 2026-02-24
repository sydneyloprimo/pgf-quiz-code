import { CONTENTFUL_CONTENT_TYPES } from './config'

import { contentfulClient } from '@/contentful/client'

/**
 * Fetches a feature flag from Contentful by key. Returns false when
 * Contentful is unavailable, the flag does not exist, or enabled is false.
 *
 * Contentful setup: Create a content type "featureFlag" with fields:
 * - key (Short text, required)
 * - enabled (Boolean, required)
 *
 * Create an entry with key "waitlistFlip" and enabled true/false.
 */
export async function getFeatureFlag(key: string): Promise<boolean> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  if (!spaceId || !accessToken) return false

  try {
    const response = await contentfulClient.getEntries({
      content_type: CONTENTFUL_CONTENT_TYPES.featureFlag,
      'fields.key': key,
      limit: 1,
    })

    const item = response.items[0]
    if (!item?.fields?.enabled) return false

    const enabled = item.fields.enabled
    return enabled === true
  } catch {
    return false
  }
}
