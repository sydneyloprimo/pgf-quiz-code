import { cache } from 'react'

import { contentfulClient } from '@/contentful/client'

const CONTENTFUL_LOCALE = 'en-US'
const ASSETS_LIMIT = 1000

interface AssetItem {
  sys?: { updatedAt?: string }
  fields: {
    title?: { [locale: string]: string } | string
    file?:
      | {
          [locale: string]: { url?: string }
        }
      | { url?: string }
  }
}

async function fetchAssetsPage(
  skip: number,
  limit: number
): Promise<AssetItem[]> {
  const res = await contentfulClient.getAssets({
    limit,
    skip,
    locale: CONTENTFUL_LOCALE,
  })
  return res.items as unknown as AssetItem[]
}

/**
 * Fetches all site image assets from Contentful and builds a path -> URL map.
 * Uses the same Delivery API client as copies. Cached per request.
 */
async function fetchAssetMap(): Promise<Record<string, string>> {
  const map: Record<string, string> = {}
  let skip = 0
  const limit = ASSETS_LIMIT
  while (true) {
    const items = await fetchAssetsPage(skip, limit)
    for (const item of items) {
      const rawTitle = item.fields?.title
      const title =
        typeof rawTitle === 'string'
          ? rawTitle
          : ((rawTitle as { [key: string]: string })?.[CONTENTFUL_LOCALE] ??
            (rawTitle as { [key: string]: string })?.['en-US'])
      const rawFile = item.fields?.file
      const file =
        typeof rawFile === 'object' && rawFile !== null && 'url' in rawFile
          ? (rawFile as { url?: string })
          : ((rawFile as { [key: string]: { url?: string } })?.[
              CONTENTFUL_LOCALE
            ] ?? (rawFile as { [key: string]: { url?: string } })?.['en-US'])
      const url = file?.url
      if (typeof title === 'string' && typeof url === 'string') {
        const fullUrl = url.startsWith('//') ? `https:${url}` : url
        map[title] = fullUrl
      }
    }
    if (items.length < limit) break
    skip += limit
  }
  return map
}

const getAssetMapCached = cache(fetchAssetMap)

/**
 * Resolves a public image path to a Contentful URL when available.
 * Falls back to the given path (served from /public) on any failure.
 * Use from server components or API routes.
 */
export async function getContentfulImageUrl(path: string): Promise<string> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  try {
    const map = await getAssetMapCached()
    const url = map[normalizedPath]
    if (url) return url
  } catch {
    // Contentful down or missing env: fall back to local path
  }
  return normalizedPath
}

/**
 * Returns the full asset map (path -> Contentful URL). Cached per request.
 * Use when you need multiple lookups in one place.
 */
export async function getContentfulImageMap(): Promise<Record<string, string>> {
  try {
    return await getAssetMapCached()
  } catch {
    return {}
  }
}

/**
 * Diagnostic: fetch one page of assets to see why the map might be empty.
 * Used when X-Contentful-Image-Map-Count is 0.
 */
export async function getContentfulImageMapDiagnostic(): Promise<{
  total: number
  itemsInPage: number
  error?: string
  firstItemTitle?: string
}> {
  try {
    const res = await contentfulClient.getAssets({
      limit: 2,
      skip: 0,
      locale: CONTENTFUL_LOCALE,
    })
    const total = res.total ?? 0
    const items = res.items as unknown as AssetItem[]
    const first = items[0]
    const rawTitle = first?.fields?.title
    const firstItemTitle =
      typeof rawTitle === 'string'
        ? rawTitle
        : ((rawTitle as { [key: string]: string })?.[CONTENTFUL_LOCALE] ??
          (rawTitle as { [key: string]: string })?.['en-US'])
    return {
      total,
      itemsInPage: items.length,
      firstItemTitle:
        typeof firstItemTitle === 'string' ? firstItemTitle : undefined,
    }
  } catch (err) {
    return {
      total: 0,
      itemsInPage: 0,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}
