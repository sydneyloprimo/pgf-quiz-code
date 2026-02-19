import { contentfulClient } from '@/contentful/client'

const SECTION_CONTENT_TYPE_ID = 'section'
const RICH_TEXT_PAGE_CONTENT_TYPE_ID = 'richTextPage'
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
 * Gets a localized field value from a Contentful entry field.
 */
function getLocalizedField(field: unknown, locale: string): unknown {
  if (
    typeof field === 'string' ||
    typeof field === 'number' ||
    typeof field === 'boolean'
  ) {
    return field
  }
  if (field && typeof field === 'object') {
    const fieldObj = field as Record<string, unknown>
    return fieldObj[locale] ?? fieldObj['en-US'] ?? field
  }
  return field
}

interface SectionEntry {
  sys: { id: string }
  fields: {
    key?: unknown
    name?: unknown
    content?: unknown
    sections?: unknown
  }
}

/**
 * Builds a nested object from a Section entry and its resolved child entries.
 * Uses contentfulLocale when reading fields so we match the API response
 * (Delivery API may return fields keyed by locale e.g. "en-US").
 */
function sectionToNestedObject(
  entry: SectionEntry,
  entryMap: Map<string, SectionEntry>,
  contentfulLocale: string
): Record<string, unknown> {
  const key = getLocalizedField(entry.fields.key, contentfulLocale)
  const content = getLocalizedField(entry.fields.content, contentfulLocale)
  const sections = getLocalizedField(entry.fields.sections, contentfulLocale)

  const result: Record<string, unknown> = {}

  if (content && typeof content === 'object' && !Array.isArray(content)) {
    for (const [k, v] of Object.entries(content)) {
      if (
        typeof v === 'string' ||
        typeof v === 'number' ||
        typeof v === 'boolean'
      ) {
        result[k] = v
      }
    }
  }

  if (sections && Array.isArray(sections)) {
    for (const ref of sections) {
      const id =
        ref && typeof ref === 'object' && ref !== null && 'sys' in ref
          ? (ref as { sys: { id: string } }).sys.id
          : null
      if (!id) continue
      const childEntry = entryMap.get(id)
      if (!childEntry) continue
      const childKey = getLocalizedField(
        childEntry.fields.key,
        contentfulLocale
      )
      if (typeof childKey !== 'string') continue
      result[childKey] = sectionToNestedObject(
        childEntry,
        entryMap,
        contentfulLocale
      )
    }
  }

  return result
}

/**
 * Flattens a nested object into dot-separated paths. Skips rich text documents.
 */
function flattenObject(
  obj: Record<string, unknown>,
  prefix = ''
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      result[path] = String(value)
    } else if (value === null || value === undefined) {
      // Skip
    } else if (
      typeof value === 'object' &&
      'nodeType' in value &&
      (value as { nodeType: string }).nodeType === 'document'
    ) {
      // Rich text - not included in copy map; use getRichTextCopy
    } else if (Array.isArray(value)) {
      result[path] = JSON.stringify(value)
    } else if (typeof value === 'object') {
      Object.assign(
        result,
        flattenObject(value as Record<string, unknown>, path)
      )
    }
  }
  return result
}

/**
 * Fetches all Section entries and builds the nested copy tree, then flattens to a dot-separated map.
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
    const entryMap = new Map<string, SectionEntry>()
    const linkedIds = new Set<string>()
    const LIMIT = 100
    let skip = 0
    let total: number

    do {
      const response = await contentfulClient.getEntries({
        content_type: SECTION_CONTENT_TYPE_ID,
        locale: contentfulLocale,
        include: 10,
        limit: LIMIT,
        skip,
      })
      total = response.total ?? 0
      const allEntries = [
        ...response.items,
        ...(response.includes?.Entry ?? []),
      ] as unknown as SectionEntry[]
      for (const entry of allEntries) {
        entryMap.set(entry.sys.id, entry)
      }
      skip += LIMIT
    } while (skip < total)

    for (const entry of entryMap.values()) {
      const sections = getLocalizedField(
        entry.fields.sections,
        contentfulLocale
      )
      if (sections && Array.isArray(sections)) {
        for (const ref of sections) {
          const id =
            ref && typeof ref === 'object' && ref !== null && 'sys' in ref
              ? (ref as { sys: { id: string } }).sys.id
              : null
          if (id) linkedIds.add(id)
        }
      }
    }

    const rootIds = [...entryMap.keys()].filter((id) => !linkedIds.has(id))
    const nested: Record<string, unknown> = {}

    for (const rootId of rootIds) {
      const rootEntry = entryMap.get(rootId)
      if (!rootEntry) continue
      const rootKey = getLocalizedField(rootEntry.fields.key, contentfulLocale)
      if (typeof rootKey !== 'string') continue
      nested[rootKey] = sectionToNestedObject(
        rootEntry,
        entryMap,
        contentfulLocale
      )
    }

    return flattenObject(nested)
  } catch {
    return {}
  }
}

/**
 * Sets a nested value in obj using dot-separated path (e.g. "Home.Hero.headline").
 */
function setByPath(
  obj: Record<string, unknown>,
  path: string,
  value: string
): void {
  const parts = path.split('.')
  let current: Record<string, unknown> = obj
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }

  const lastKey = parts[parts.length - 1]
  if (value.startsWith('{') && value.includes('nodeType')) {
    try {
      current[lastKey] = JSON.parse(value)
    } catch {
      current[lastKey] = value
    }
  } else {
    current[lastKey] = value
  }
}

/**
 * Merges a flat Contentful copy map into a nested messages object.
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
 * Fetches rich text content from a RichTextPage entry by key (e.g. "PrivacyPolicy", "TermsAndConditions").
 */
export async function getRichTextCopy(
  key: string,
  locale: string
): Promise<RichTextDocument | null> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  if (!spaceId || !accessToken) return null
  const contentfulLocale = CONTENTFUL_LOCALE_MAP[locale] ?? locale

  const keyParts = key.split('.')
  if (keyParts.length !== 2 || keyParts[1] !== 'content') {
    return null
  }
  const pageKey = keyParts[0]

  try {
    const response = await contentfulClient.getEntries({
      content_type: RICH_TEXT_PAGE_CONTENT_TYPE_ID,
      'fields.key': pageKey,
      locale: contentfulLocale,
      limit: 1,
    })

    const item = response.items[0]
    if (!item?.fields?.content) return null

    const content = getLocalizedField(item.fields.content, contentfulLocale)
    if (
      content &&
      typeof content === 'object' &&
      'nodeType' in content &&
      (content as { nodeType: string }).nodeType === 'document'
    ) {
      return content as RichTextDocument
    }

    return null
  } catch {
    return null
  }
}
