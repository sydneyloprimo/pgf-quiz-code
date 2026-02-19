import { contentfulClient } from '@/contentful/client'

const EXPERTS_SECTION_CONTENT_TYPE_ID = 'expertsSection'
const CONTENTFUL_LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  es: 'es',
}

export interface ExpertItemContentful {
  name: string
  description: string
  imageUrl: string | null
  imageAlt: string
}

export interface ExpertsSectionContent {
  title: string
  ecvcnParagraph1: string
  ecvcnParagraph2: string
  ecvcnParagraph3: string
  experts: ExpertItemContentful[]
}

function getString(value: unknown, contentfulLocale: string): string {
  if (typeof value === 'string') return value
  const obj = value as Record<string, string> | undefined
  return obj?.[contentfulLocale] ?? obj?.['en-US'] ?? ''
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
 * Fetches the Experts section from Contentful (singleton or first entry).
 * Returns null when Contentful is unavailable or has no entry.
 */
export async function getExpertsSection(
  locale: string
): Promise<ExpertsSectionContent | null> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  if (!spaceId || !accessToken) return null
  const contentfulLocale = CONTENTFUL_LOCALE_MAP[locale] ?? locale
  try {
    const response = await contentfulClient.getEntries({
      content_type: EXPERTS_SECTION_CONTENT_TYPE_ID,
      locale: contentfulLocale,
      limit: 1,
      include: 2,
    })
    const item = response.items[0]
    if (!item?.fields) return null
    const expertsRefs = item.fields.experts
    const expertsList = Array.isArray(expertsRefs) ? expertsRefs : []
    const experts: ExpertItemContentful[] = expertsList
      .slice(0, 3)
      .map((ref: unknown) => {
        const entry = ref as { fields?: Record<string, unknown> }
        const fields = entry?.fields ?? {}
        const name = getString(fields.name, contentfulLocale)
        const description = getString(fields.description, contentfulLocale)
        const imageAlt = getString(fields.imageAlt, contentfulLocale)
        const imageAsset = fields.image
        const imageUrl = imageAsset ? getAssetUrl(imageAsset) : null
        const imageUrlFallback = getString(
          (fields as { imageUrl?: unknown }).imageUrl,
          contentfulLocale
        )
        return {
          name,
          description,
          imageUrl: imageUrl ?? (imageUrlFallback || null),
          imageAlt: imageAlt || name,
        }
      })
    return {
      title: getString(item.fields.title, contentfulLocale),
      ecvcnParagraph1: getString(item.fields.ecvcnParagraph1, contentfulLocale),
      ecvcnParagraph2: getString(item.fields.ecvcnParagraph2, contentfulLocale),
      ecvcnParagraph3: getString(item.fields.ecvcnParagraph3, contentfulLocale),
      experts,
    }
  } catch {
    return null
  }
}
