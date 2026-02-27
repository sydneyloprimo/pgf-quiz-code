import {
  CONTACT_INFORMATION_KEYS,
  CONTENTFUL_CONTENT_TYPES,
  CONTENTFUL_FIELDS,
  CONTENTFUL_LOCALE,
} from './config'

import { contentfulClient } from '@/contentful/client'

function getLocalizedField(field: unknown): string | null {
  if (typeof field === 'string') return field
  if (field && typeof field === 'object') {
    const obj = field as Record<string, unknown>
    const val = obj[CONTENTFUL_LOCALE] ?? obj['en-US']
    return typeof val === 'string' ? val : null
  }
  return null
}

/**
 * Fetches a contact information value from Contentful by key. Returns null when
 * Contentful is unavailable or the entry does not exist.
 *
 * Contentful setup: Create a content type "contactInformation" with fields:
 * - key (Short text, required)
 * - value (Long text, required)
 */
export async function getContactInformation(
  key: string
): Promise<string | null> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  if (!spaceId || !accessToken) return null

  try {
    const response = await contentfulClient.getEntries({
      content_type: CONTENTFUL_CONTENT_TYPES.contactInformation,
      locale: CONTENTFUL_LOCALE,
      [`fields.${CONTENTFUL_FIELDS.key}`]: key,
      limit: 1,
    })

    const item = response.items[0]
    if (!item?.fields?.value) return null

    return getLocalizedField(item.fields.value)
  } catch {
    return null
  }
}

/**
 * Fetches all contact information entries and returns a map of key -> value.
 * Used for concierge email and phone.
 */
export async function getContactInformationMap(): Promise<
  Record<string, string>
> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  if (!spaceId || !accessToken) return {}

  try {
    const response = await contentfulClient.getEntries({
      content_type: CONTENTFUL_CONTENT_TYPES.contactInformation,
      locale: CONTENTFUL_LOCALE,
      limit: 100,
    })

    const result: Record<string, string> = {}
    for (const item of response.items) {
      const key = getLocalizedField(item.fields?.key)
      const value = getLocalizedField(item.fields?.value)
      if (key && value) {
        result[key] = value
      }
    }
    return result
  } catch {
    return {}
  }
}

export { CONTACT_INFORMATION_KEYS }
