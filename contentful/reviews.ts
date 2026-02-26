import { CONTENTFUL_CONTENT_TYPES } from './config'

import { contentfulClient } from '@/contentful/client'

const CONTENTFUL_LOCALE = 'en-US'

export interface CustomerReview {
  profilePictureUrl: string
  heading: string
  content: string
  clientName: string
}

function getString(value: unknown): string {
  if (typeof value === 'string') return value
  const obj = value as Record<string, string> | undefined
  return obj?.[CONTENTFUL_LOCALE] ?? obj?.['en-US'] ?? ''
}

function getAssetUrl(asset: unknown): string | null {
  if (!asset || typeof asset !== 'object' || !('fields' in asset)) return null
  const fields = (asset as { fields?: { file?: { url?: string } } }).fields
  const file = fields?.file
  if (typeof file !== 'object' || !file) return null
  const url = file.url
  if (typeof url !== 'string') return null
  return url.startsWith('//') ? `https:${url}` : url
}

/**
 * Fetches customer reviews from Contentful. Returns empty array when
 * Contentful is unavailable or has no entries.
 */
export async function getCustomerReviews(): Promise<CustomerReview[]> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  if (!spaceId || !accessToken) return []

  try {
    const response = await contentfulClient.getEntries({
      content_type: CONTENTFUL_CONTENT_TYPES.customerReview,
      locale: CONTENTFUL_LOCALE,
      order: ['sys.createdAt'],
      include: 1,
    })

    return response.items
      .filter((item) => item?.fields)
      .map((item) => {
        const fields = item.fields as Record<string, unknown>
        const profilePicture = fields.profilePicture
        const profilePictureUrl = profilePicture
          ? getAssetUrl(profilePicture)
          : null
        return {
          profilePictureUrl: profilePictureUrl ?? '',
          heading: getString(fields.heading),
          content: getString(fields.content),
          clientName: getString(fields.clientName),
        }
      })
      .filter(
        (r) => r.profilePictureUrl && r.heading && r.content && r.clientName
      )
  } catch {
    return []
  }
}
