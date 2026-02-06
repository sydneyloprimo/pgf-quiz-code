import { contentfulClient } from '@/contentful/client'

const PAGE_CONTENT_TYPE_ID = 'page'
const GLOBAL_SETTINGS_CONTENT_TYPE_ID = 'globalSettings'
const CONTENTFUL_LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  es: 'es',
}

// Component content type IDs
const COMPONENT_TYPE_IDS: Record<string, string> = {
  heroComponent: 'Hero',
  benefitsComponent: 'Benefits',
  faqComponent: 'FAQ',
  reviewsComponent: 'Reviews',
  featuresComponent: 'Features',
  howItWorksComponent: 'HowItWorks',
  textBlockComponent: 'TextBlock',
  richTextComponent: 'RichText',
}

// Map slugs to page keys
const SLUG_TO_PAGE_KEY: Record<string, string> = {
  '/': 'Home',
  '/about': 'About',
  '/formulation': 'Formulation',
  '/cart': 'Cart',
  '/detail': 'Detail',
  '/orders': 'Orders',
  '/quiz': 'Quiz',
  '/auth/sign-in': 'Auth',
  '/auth/sign-up': 'SignUp',
  '/blog': 'BlogIndex',
  '/products': 'Search',
  '/privacy-policy': 'PrivacyPolicy',
  '/terms-and-conditions': 'TermsAndConditions',
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

/**
 * Reconstructs component data from Contentful entry fields.
 */
function reconstructComponentData(
  componentEntry: { fields: Record<string, unknown> },
  componentType: string,
  locale: string
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  const fields = componentEntry.fields

  switch (componentType) {
    case 'Hero':
      if (fields.headline)
        result.headline = getLocalizedField(fields.headline, locale)
      if (fields.subhead)
        result.subhead = getLocalizedField(fields.subhead, locale)
      if (fields.ctaButton)
        result.ctaButton = getLocalizedField(fields.ctaButton, locale)
      if (fields.ctaLink)
        result.ctaLink = getLocalizedField(fields.ctaLink, locale)
      if (fields.imageAlt)
        result.imageAlt = getLocalizedField(fields.imageAlt, locale)
      break

    case 'Benefits':
      if (fields.title) result.title = getLocalizedField(fields.title, locale)
      if (fields.description)
        result.description = getLocalizedField(fields.description, locale)
      if (fields.benefits) {
        const benefits = getLocalizedField(fields.benefits, locale)
        if (benefits && typeof benefits === 'object') {
          Object.assign(result, benefits)
        }
      }
      if (fields.imageAlt)
        result.imageAlt = getLocalizedField(fields.imageAlt, locale)
      break

    case 'FAQ':
      if (fields.title) result.title = getLocalizedField(fields.title, locale)
      if (fields.questions) {
        const questions = getLocalizedField(fields.questions, locale)
        if (questions && typeof questions === 'object') {
          Object.assign(result, questions)
        }
      }
      break

    case 'Reviews':
      if (fields.title) result.title = getLocalizedField(fields.title, locale)
      if (fields.reviews) {
        const reviews = getLocalizedField(fields.reviews, locale)
        if (reviews && typeof reviews === 'object') {
          Object.assign(result, reviews)
        }
      }
      break

    case 'Features':
      if (fields.title) result.title = getLocalizedField(fields.title, locale)
      if (fields.features) {
        const features = getLocalizedField(fields.features, locale)
        if (features && typeof features === 'object') {
          Object.assign(result, features)
        }
      }
      break

    case 'HowItWorks':
      if (fields.title) result.title = getLocalizedField(fields.title, locale)
      if (fields.steps) {
        const steps = getLocalizedField(fields.steps, locale)
        if (steps && typeof steps === 'object') {
          Object.assign(result, steps)
        }
      }
      break

    case 'TextBlock':
      if (fields.title) result.title = getLocalizedField(fields.title, locale)
      if (fields.description)
        result.description = getLocalizedField(fields.description, locale)
      if (fields.content)
        result.content = getLocalizedField(fields.content, locale)
      if (fields.ctaButton)
        result.ctaButton = getLocalizedField(fields.ctaButton, locale)
      if (fields.imageAlt)
        result.imageAlt = getLocalizedField(fields.imageAlt, locale)
      // Copy any other fields
      for (const [key, value] of Object.entries(fields)) {
        if (
          ![
            'title',
            'description',
            'content',
            'ctaButton',
            'imageAlt',
          ].includes(key)
        ) {
          result[key] = getLocalizedField(value, locale)
        }
      }
      break

    case 'RichText':
      if (fields.content) {
        const content = getLocalizedField(fields.content, locale)
        if (content && typeof content === 'object' && 'nodeType' in content) {
          result.content = content
        }
      }
      break
  }

  return result
}

/**
 * Flattens a nested object into dot-separated paths.
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
      // Skip null/undefined
    } else if (
      typeof value === 'object' &&
      'nodeType' in value &&
      (value as { nodeType: string }).nodeType === 'document'
    ) {
      // Rich text - store as JSON string for now (will be handled separately)
      result[path] = JSON.stringify(value)
    } else if (Array.isArray(value)) {
      // Arrays as JSON
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
 * Fetches a Page entry with all its components resolved.
 */
async function getPageWithComponents(
  slug: string,
  locale: string
): Promise<Record<string, unknown> | null> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  if (!spaceId || !accessToken) return null
  const contentfulLocale = CONTENTFUL_LOCALE_MAP[locale] ?? locale

  try {
    const response = await contentfulClient.getEntries({
      content_type: PAGE_CONTENT_TYPE_ID,
      'fields.slug': slug,
      locale: contentfulLocale,
      include: 10, // Include linked components
      limit: 1,
    })

    const page = response.items[0]
    if (!page?.fields) return null

    const pageKey =
      SLUG_TO_PAGE_KEY[slug] || slug.replace(/^\//, '').replace(/\//g, '')
    const result: Record<string, unknown> = {}

    // Get components linked to this page
    const components = page.fields.components
    if (components && Array.isArray(components)) {
      // Components are resolved via include
      const componentEntries = response.includes?.Entry || []

      // We need to match components to their section keys
      // Since we don't have section keys stored, we'll need to infer from component order
      // For now, we'll create a structure based on component types
      const componentMap: Record<string, unknown[]> = {}

      for (const componentRef of components) {
        const refId =
          componentRef &&
          typeof componentRef === 'object' &&
          'sys' in componentRef
            ? (componentRef as { sys: { id: string } }).sys.id
            : null

        if (refId) {
          const componentEntry = componentEntries.find(
            (entry: { sys: { id: string } }) => entry.sys.id === refId
          )

          if (componentEntry && 'sys' in componentEntry) {
            const contentTypeId = (
              componentEntry as {
                sys: { contentType: { sys: { id: string } } }
              }
            ).sys.contentType.sys.id
            const componentType = COMPONENT_TYPE_IDS[contentTypeId]

            if (componentType) {
              const componentData = reconstructComponentData(
                componentEntry as { fields: Record<string, unknown> },
                componentType,
                contentfulLocale
              )

              // Group by component type (we'll need section keys from somewhere)
              if (!componentMap[componentType]) {
                componentMap[componentType] = []
              }
              componentMap[componentType].push(componentData)
            }
          }
        }
      }

      // For now, take the first component of each type
      // In a real implementation, you'd store section keys in the Page entry
      for (const [componentType, componentDataArray] of Object.entries(
        componentMap
      )) {
        if (componentDataArray.length > 0) {
          result[componentType] = componentDataArray[0]
        }
      }
    }

    return Object.keys(result).length > 0 ? result : null
  } catch {
    return null
  }
}

/**
 * Fetches all GlobalSettings entries.
 */
async function getGlobalSettings(
  locale: string
): Promise<Record<string, Record<string, unknown>>> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  if (!spaceId || !accessToken) return {}
  const contentfulLocale = CONTENTFUL_LOCALE_MAP[locale] ?? locale

  try {
    const response = await contentfulClient.getEntries({
      content_type: GLOBAL_SETTINGS_CONTENT_TYPE_ID,
      locale: contentfulLocale,
      limit: 1000,
    })

    const result: Record<string, Record<string, unknown>> = {}
    for (const item of response.items) {
      const id = getLocalizedField(item.fields.id, contentfulLocale)
      const data = getLocalizedField(item.fields.data, contentfulLocale)

      if (typeof id === 'string' && data && typeof data === 'object') {
        result[id] = data as Record<string, unknown>
      }
    }

    return result
  } catch {
    return {}
  }
}

/**
 * Fetches all Pages and reconstructs the nested structure matching en.json format.
 */
async function getAllPagesWithComponents(
  locale: string
): Promise<Record<string, Record<string, unknown>>> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  if (!spaceId || !accessToken) return {}
  const contentfulLocale = CONTENTFUL_LOCALE_MAP[locale] ?? locale

  try {
    const response = await contentfulClient.getEntries({
      content_type: PAGE_CONTENT_TYPE_ID,
      locale: contentfulLocale,
      include: 10,
      limit: 1000,
    })

    const result: Record<string, Record<string, unknown>> = {}
    const componentEntries = response.includes?.Entry || []

    for (const page of response.items) {
      const slug = getLocalizedField(page.fields.slug, contentfulLocale)
      if (typeof slug !== 'string') continue

      const pageKey =
        SLUG_TO_PAGE_KEY[slug] || slug.replace(/^\//, '').replace(/\//g, '')
      const pageComponents: Record<string, unknown> = {}

      // Get component mapping (sectionKey -> componentEntryId)
      const componentMapping = getLocalizedField(
        page.fields.componentMapping,
        contentfulLocale
      ) as Record<string, string> | undefined

      const components = page.fields.components
      if (components && Array.isArray(components) && componentMapping) {
        // Use componentMapping to get section keys
        for (const [sectionKey, componentEntryId] of Object.entries(
          componentMapping
        )) {
          const componentEntry = componentEntries.find(
            (entry: { sys: { id: string } }) =>
              entry.sys.id === componentEntryId
          )

          if (componentEntry && 'sys' in componentEntry) {
            const contentTypeId = (
              componentEntry as {
                sys: { contentType: { sys: { id: string } } }
              }
            ).sys.contentType.sys.id
            const componentType = COMPONENT_TYPE_IDS[contentTypeId]

            if (componentType) {
              const componentData = reconstructComponentData(
                componentEntry as { fields: Record<string, unknown> },
                componentType,
                contentfulLocale
              )

              pageComponents[sectionKey] = componentData
            }
          }
        }
      } else if (components && Array.isArray(components)) {
        // Fallback: use component type as section key if mapping not available
        const componentTypeMap: Record<string, number> = {}

        for (const componentRef of components) {
          const refId =
            componentRef &&
            typeof componentRef === 'object' &&
            'sys' in componentRef
              ? (componentRef as { sys: { id: string } }).sys.id
              : null

          if (refId) {
            const componentEntry = componentEntries.find(
              (entry: { sys: { id: string } }) => entry.sys.id === refId
            )

            if (componentEntry && 'sys' in componentEntry) {
              const contentTypeId = (
                componentEntry as {
                  sys: { contentType: { sys: { id: string } } }
                }
              ).sys.contentType.sys.id
              const componentType = COMPONENT_TYPE_IDS[contentTypeId]

              if (componentType) {
                const componentData = reconstructComponentData(
                  componentEntry as { fields: Record<string, unknown> },
                  componentType,
                  contentfulLocale
                )

                const count = componentTypeMap[componentType] || 0
                componentTypeMap[componentType] = count + 1
                const sectionKey =
                  count === 0 ? componentType : `${componentType}${count + 1}`

                pageComponents[sectionKey] = componentData
              }
            }
          }
        }
      }

      if (Object.keys(pageComponents).length > 0) {
        result[pageKey] = pageComponents
      }
    }

    return result
  } catch {
    return {}
  }
}

/**
 * Fetches all Contentful content and returns a flat map compatible with mergeContentfulIntoMessages.
 * Reconstructs nested structure from component-based model.
 */
export async function getContentfulCopyMap(
  locale: string
): Promise<Record<string, string>> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  if (!spaceId || !accessToken) {
    return {}
  }

  try {
    // Fetch all pages with components
    const pages = await getAllPagesWithComponents(locale)

    // Fetch global settings
    const globalSettings = await getGlobalSettings(locale)

    // Combine into single nested structure
    const nested: Record<string, unknown> = {}

    // Add pages
    for (const [pageKey, pageData] of Object.entries(pages)) {
      nested[pageKey] = pageData
    }

    // Add global settings at root level
    for (const [namespace, data] of Object.entries(globalSettings)) {
      nested[namespace] = data
    }

    // Flatten to dot-separated paths
    return flattenObject(nested)
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

  const lastKey = parts[parts.length - 1]
  // Handle rich text JSON strings
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
 * Fetches a rich text copy entry from Contentful.
 * Now fetches from RichText components linked to Pages.
 */
export async function getRichTextCopy(
  key: string,
  locale: string
): Promise<RichTextDocument | null> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  if (!spaceId || !accessToken) return null
  const contentfulLocale = CONTENTFUL_LOCALE_MAP[locale] ?? locale

  // Parse key: "PrivacyPolicy.content" -> pageKey "PrivacyPolicy"
  const keyParts = key.split('.')
  if (keyParts.length !== 2 || keyParts[1] !== 'content') {
    return null
  }
  const pageKey = keyParts[0]
  const slug =
    Object.entries(SLUG_TO_PAGE_KEY).find(([, key]) => key === pageKey)?.[0] ||
    `/${pageKey.toLowerCase()}`

  try {
    const pageData = await getPageWithComponents(slug, locale)
    if (!pageData) return null

    // Look for RichText component
    const richTextData = pageData.RichText || pageData.content
    if (
      richTextData &&
      typeof richTextData === 'object' &&
      'content' in richTextData &&
      richTextData.content &&
      typeof richTextData.content === 'object' &&
      'nodeType' in richTextData.content &&
      (richTextData.content as { nodeType: string }).nodeType === 'document'
    ) {
      return richTextData.content as RichTextDocument
    }

    return null
  } catch {
    return null
  }
}
