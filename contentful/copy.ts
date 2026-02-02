import { contentfulClient } from '@/contentful/client'

const COPY_CONTENT_TYPE_ID = 'copy'
const RICH_TEXT_COPY_CONTENT_TYPE_ID = 'richTextCopy'
const CONTENTFUL_LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  es: 'es',
}

export interface RichTextDocument {
  nodeType: string
  data: Record<string, unknown>
  content: unknown[]
}

/**
 * Fetches all Copy entries from Contentful for the given app locale and
 * returns a flat map of key -> value. Returns {} when Contentful is
 * unavailable or fails.
 */
export async function getContentfulCopyMap(
  locale: string
): Promise<Record<string, string>> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  if (!spaceId || !accessToken) {
    return {}
  }
  const contentfulLocale = CONTENTFUL_LOCALE_MAP[locale] ?? locale
  try {
    const response = await contentfulClient.getEntries({
      content_type: COPY_CONTENT_TYPE_ID,
      limit: 1000,
      locale: contentfulLocale,
    })
    const map: Record<string, string> = {}
    for (const item of response.items) {
      const rawKey = item.fields.key
      const rawValue = item.fields.value
      const key =
        typeof rawKey === 'string'
          ? rawKey
          : ((rawKey as Record<string, string>)?.[contentfulLocale] ??
            (rawKey as Record<string, string>)?.['en-US'])
      const value =
        typeof rawValue === 'string'
          ? rawValue
          : ((rawValue as Record<string, string>)?.[contentfulLocale] ??
            (rawValue as Record<string, string>)?.['en-US'])
      if (typeof key === 'string' && typeof value === 'string') {
        map[key] = value
      }
    }
    return map
  } catch {
    return {}
  }
}

/**
 * Sets a nested value in obj using dot-separated path (e.g. "Home.Hero.headline").
 */
function setByPath(obj: Record<string, unknown>, path: string, value: string) {
  const parts = path.split('.')
  let current: Record<string, unknown> = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]
    const nextKey = parts[i + 1]
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }
  current[parts[parts.length - 1]] = value
}

/**
 * Merges a flat Contentful copy map into a nested messages object.
 * Contentful values override existing keys.
 */
export function mergeContentfulIntoMessages(
  messages: Record<string, unknown>,
  copyMap: Record<string, string>
): Record<string, unknown> {
  const result = JSON.parse(JSON.stringify(messages)) as Record<string, unknown>
  for (const [key, value] of Object.entries(copyMap)) {
    setByPath(result, key, value)
  }
  return result
}

/**
 * Fetches a single rich text copy entry from Contentful by key (e.g.
 * "PrivacyPolicy.content", "TermsAndConditions.content"). Returns null when
 * not found or on error.
 */
export async function getRichTextCopy(
  key: string,
  locale: string
): Promise<RichTextDocument | null> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  if (!spaceId || !accessToken) return null
  const contentfulLocale = CONTENTFUL_LOCALE_MAP[locale] ?? locale
  try {
    const response = await contentfulClient.getEntries({
      content_type: RICH_TEXT_COPY_CONTENT_TYPE_ID,
      'fields.key': key,
      locale: contentfulLocale,
      limit: 1,
    })
    const item = response.items[0]
    if (!item?.fields?.content) return null
    const raw =
      typeof item.fields.content === 'object' &&
      item.fields.content !== null &&
      'nodeType' in (item.fields.content as object)
        ? (item.fields.content as RichTextDocument)
        : ((item.fields.content as Record<string, unknown>)?.[
            contentfulLocale
          ] ?? (item.fields.content as Record<string, unknown>)?.['en-US'])
    if (
      raw &&
      typeof raw === 'object' &&
      'nodeType' in raw &&
      (raw as RichTextDocument).nodeType === 'document'
    ) {
      return raw as RichTextDocument
    }
    return null
  } catch {
    return null
  }
}
