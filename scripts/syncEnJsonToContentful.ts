/**
 * Syncs en.json structure to Contentful using component-based architecture:
 * - Tier 1: Page content type (containers)
 * - Tier 2: Component content types (reusable blocks)
 * - Tier 3: GlobalSettings content type (site-wide content)
 *
 * Requires: CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN in env.
 * Run: yarn contentful:sync
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

import contentfulManagement from 'contentful-management'
import { config } from 'dotenv'

import {
  analyzeEnJson,
  ComponentType,
  isRichTextDocument,
} from './componentAnalyzer'

config({ path: '.env.local' })

const CONTENTFUL_LOCALE = 'en-US'
const ENVIRONMENT_ID = 'master'

// Content type IDs
const PAGE_CONTENT_TYPE_ID = 'page'
const GLOBAL_SETTINGS_CONTENT_TYPE_ID = 'globalSettings'
const QUIZ_BREED_OPTION_CONTENT_TYPE_ID = 'quizBreedOption'
const EXPERT_CONTENT_TYPE_ID = 'expert'
const EXPERTS_SECTION_CONTENT_TYPE_ID = 'expertsSection'

// Component content type IDs
const COMPONENT_TYPE_IDS: Record<ComponentType, string> = {
  Hero: 'heroComponent',
  Benefits: 'benefitsComponent',
  FAQ: 'faqComponent',
  Reviews: 'reviewsComponent',
  Features: 'featuresComponent',
  HowItWorks: 'howItWorksComponent',
  TextBlock: 'textBlockComponent',
  RichText: 'richTextComponent',
}

interface EnvironmentLike {
  getContentTypes(): Promise<{
    items: Array<{
      sys: { id: string; publishedAt?: string | null }
    }>
  }>
  createContentTypeWithId(
    id: string,
    data: Record<string, unknown>
  ): Promise<{ publish(): Promise<unknown> }>
  getEntries(query: Record<string, unknown>): Promise<{
    items: Array<{
      sys: { id: string; publishedAt?: string | null }
      fields: Record<string, unknown>
      publish(): Promise<unknown>
    }>
  }>
  createEntry(
    contentTypeId: string,
    data: { fields: Record<string, Record<string, unknown>> }
  ): Promise<{ sys: { id: string }; publish(): Promise<unknown> }>
}

async function getEnvironment(): Promise<EnvironmentLike> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN

  if (!spaceId || !managementToken) {
    throw new Error(
      'CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN must be set'
    )
  }

  const client = contentfulManagement.createClient({
    accessToken: managementToken,
  })
  const space = await client.getSpace(spaceId)
  return await space.getEnvironment(ENVIRONMENT_ID)
}

/**
 * Processes items in batches with concurrency limit to avoid rate limits.
 */
async function processInBatches<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10,
  label?: string
): Promise<R[]> {
  const results: R[] = []
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.allSettled(
      batch.map((item) => processor(item))
    )

    for (let j = 0; j < batchResults.length; j++) {
      const result = batchResults[j]
      if (result.status === 'fulfilled') {
        results.push(result.value)
      } else {
        const item = batch[j]
        console.error(
          `${label ? `${label}: ` : ''}Failed to process item:`,
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason)
        )
      }
    }
  }
  return results
}

/**
 * Infers a title from section key and page key.
 * Formats camelCase/PascalCase keys into readable titles.
 */
function inferTitle(sectionKey: string, pageKey: string): string {
  // Special cases for common section names
  const titleMap: Record<string, string> = {
    Hero: 'Hero Section',
    Content: 'Content',
    EmptyState: 'Empty State',
    emptyState: 'Empty State',
    FilterPanel: 'Filter Panel',
    filterPanel: 'Filter Panel',
    BostonAnnouncement: 'Boston Announcement',
    ClinicallyApproved: 'Clinically Approved',
    ExploreCategories: 'Explore Categories',
    HeroBanner: 'Hero Banner',
    LatestProducts: 'Latest Products',
    ShopProducts: 'Shop Products',
    VetNutritionist: 'Vet Nutritionist',
    GoldenMeals: 'Golden Meals',
    neuteredStatus: 'Neutered Status',
    bodyShape: 'Body Shape',
    plus25Lbs: 'Plus 25 Lbs',
    underAge: 'Under Age',
    howActive: 'How Active',
    breedSelection: 'Breed Selection',
    resultsHeader: 'Results Header',
    validation: 'Validation',
    step1: 'Step 1',
    step2: 'Step 2',
  }

  // Check exact match first
  if (titleMap[sectionKey]) {
    return titleMap[sectionKey]
  }

  // Convert camelCase/PascalCase to Title Case
  const formatted = sectionKey
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim()

  // Check formatted match
  if (titleMap[formatted]) {
    return titleMap[formatted]
  }

  // Return formatted version or fallback to original
  return formatted || sectionKey
}

/**
 * Prepares component data for Contentful based on component type.
 * @param sectionKey - The section key from en.json (e.g., "Hero", "emptyState")
 * @param pageKey - The page key from en.json (e.g., "Home", "Cart")
 */
function prepareComponentData(
  componentType: ComponentType,
  data: Record<string, unknown>,
  sectionKey?: string,
  pageKey?: string
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  switch (componentType) {
    case 'Hero':
      if (typeof data.headline === 'string') result.headline = data.headline
      if (typeof data.subhead === 'string') result.subhead = data.subhead
      if (typeof data.ctaButton === 'string') result.ctaButton = data.ctaButton
      if (typeof data.ctaLink === 'string') result.ctaLink = data.ctaLink
      if (typeof data.imageAlt === 'string') result.imageAlt = data.imageAlt
      break

    case 'Benefits': {
      if (typeof data.title === 'string') result.title = data.title
      if (typeof data.description === 'string')
        result.description = data.description
      // Store all benefit fields as a structured object
      const benefits: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(data)) {
        if (key.startsWith('benefit') || key.startsWith('pointer')) {
          benefits[key] = value
        }
      }
      if (Object.keys(benefits).length > 0) {
        result.benefits = benefits
      }
      if (typeof data.imageAlt === 'string') result.imageAlt = data.imageAlt
      break
    }

    case 'FAQ': {
      if (typeof data.title === 'string') result.title = data.title
      const questions: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(data)) {
        if (key.startsWith('faq') || key.startsWith('decorative')) {
          questions[key] = value
        }
      }
      if (Object.keys(questions).length > 0) {
        result.questions = questions
      }
      break
    }

    case 'Reviews': {
      if (typeof data.title === 'string') result.title = data.title
      const reviews: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(data)) {
        if (
          key.startsWith('review') ||
          key === 'nextAria' ||
          key === 'prevAria'
        ) {
          reviews[key] = value
        }
      }
      if (Object.keys(reviews).length > 0) {
        result.reviews = reviews
      }
      break
    }

    case 'Features': {
      if (typeof data.title === 'string') result.title = data.title
      const features: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(data)) {
        if (
          key.endsWith('Title') ||
          key.endsWith('Description') ||
          key === 'title'
        ) {
          features[key] = value
        }
      }
      if (Object.keys(features).length > 0) {
        result.features = features
      }
      break
    }

    case 'HowItWorks': {
      if (typeof data.title === 'string') result.title = data.title
      const steps: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(data)) {
        if (key.startsWith('step')) {
          steps[key] = value
        }
      }
      if (Object.keys(steps).length > 0) {
        result.steps = steps
      }
      break
    }

    case 'TextBlock': {
      // Always ensure a title exists - infer from sectionKey if missing
      if (typeof data.title === 'string' && data.title.trim()) {
        result.title = data.title
      } else if (sectionKey && pageKey) {
        result.title = `${pageKey} - ${inferTitle(sectionKey, pageKey)}`
      } else if (sectionKey) {
        result.title = inferTitle(sectionKey, '')
      } else {
        result.title = 'Untitled Text Block'
      }

      if (typeof data.description === 'string')
        result.description = data.description
      if (typeof data.content === 'string') result.content = data.content
      if (typeof data.ctaButton === 'string') result.ctaButton = data.ctaButton
      if (typeof data.imageAlt === 'string') result.imageAlt = data.imageAlt
      if (typeof data.backgroundImageAlt === 'string')
        result.imageAlt = data.backgroundImageAlt
      if (typeof data.subtitle === 'string') result.description = data.subtitle
      if (typeof data.button === 'string') result.ctaButton = data.button

      // Store all other fields in the data object
      const additionalData: Record<string, unknown> = {}
      const standardFields = [
        'title',
        'description',
        'content',
        'ctaButton',
        'imageAlt',
        'backgroundImageAlt',
        'subtitle',
        'button',
      ]

      for (const [key, value] of Object.entries(data)) {
        if (!standardFields.includes(key)) {
          additionalData[key] = value
        }
      }

      if (Object.keys(additionalData).length > 0) {
        result.data = additionalData
      }
      break
    }

    case 'RichText': {
      // Always ensure a title exists - infer from sectionKey if missing
      if (sectionKey && pageKey) {
        result.title = `${pageKey} - ${inferTitle(sectionKey, pageKey)}`
      } else if (sectionKey) {
        result.title = inferTitle(sectionKey, '')
      } else {
        result.title = 'Untitled Rich Text'
      }

      if (isRichTextDocument(data.content)) {
        result.content = data.content
      }
      break
    }
  }

  return result
}

/**
 * Creates a component content type if it doesn't exist.
 */
async function ensureComponentContentType(
  environment: EnvironmentLike,
  componentType: ComponentType
): Promise<void> {
  const contentTypeId = COMPONENT_TYPE_IDS[componentType]
  const existing = await environment.getContentTypes()
  const exists = existing.items.some((ct) => ct.sys.id === contentTypeId)

  if (exists) {
    return
  }

  let fields: Array<{
    id: string
    name: string
    type: string
    required: boolean
  }> = []

  switch (componentType) {
    case 'Hero': {
      fields = [
        { id: 'headline', name: 'Headline', type: 'Symbol', required: false },
        { id: 'subhead', name: 'Subhead', type: 'Text', required: false },
        {
          id: 'ctaButton',
          name: 'CTA Button',
          type: 'Symbol',
          required: false,
        },
        { id: 'ctaLink', name: 'CTA Link', type: 'Symbol', required: false },
        { id: 'imageAlt', name: 'Image Alt', type: 'Symbol', required: false },
      ]
      break
    }
    case 'Benefits': {
      fields = [
        { id: 'title', name: 'Title', type: 'Symbol', required: false },
        {
          id: 'description',
          name: 'Description',
          type: 'Text',
          required: false,
        },
        { id: 'benefits', name: 'Benefits', type: 'Object', required: false },
        { id: 'imageAlt', name: 'Image Alt', type: 'Symbol', required: false },
      ]
      break
    }
    case 'FAQ': {
      fields = [
        { id: 'title', name: 'Title', type: 'Symbol', required: false },
        { id: 'questions', name: 'Questions', type: 'Object', required: false },
      ]
      break
    }
    case 'Reviews': {
      fields = [
        { id: 'title', name: 'Title', type: 'Symbol', required: false },
        { id: 'reviews', name: 'Reviews', type: 'Object', required: false },
      ]
      break
    }
    case 'Features': {
      fields = [
        { id: 'title', name: 'Title', type: 'Symbol', required: false },
        { id: 'features', name: 'Features', type: 'Object', required: false },
      ]
      break
    }
    case 'HowItWorks': {
      fields = [
        { id: 'title', name: 'Title', type: 'Symbol', required: false },
        { id: 'steps', name: 'Steps', type: 'Object', required: false },
      ]
      break
    }
    case 'TextBlock': {
      fields = [
        { id: 'title', name: 'Title', type: 'Symbol', required: false },
        {
          id: 'description',
          name: 'Description',
          type: 'Text',
          required: false,
        },
        { id: 'content', name: 'Content', type: 'Text', required: false },
        {
          id: 'ctaButton',
          name: 'CTA Button',
          type: 'Symbol',
          required: false,
        },
        { id: 'imageAlt', name: 'Image Alt', type: 'Symbol', required: false },
        {
          id: 'data',
          name: 'Additional Data',
          type: 'Object',
          required: false,
        },
      ]
      break
    }
    case 'RichText': {
      fields = [
        { id: 'title', name: 'Title', type: 'Symbol', required: false },
        { id: 'content', name: 'Content', type: 'RichText', required: false },
      ]
      break
    }
  }

  // Determine displayField - prefer 'title' if available, otherwise first field
  const displayField =
    fields.find((f) => f.id === 'title')?.id || fields[0]?.id || 'id'

  try {
    const ct = await environment.createContentTypeWithId(contentTypeId, {
      name: `${componentType} Component`,
      displayField,
      fields,
    })
    await ct.publish()
    console.log(`Created component content type: ${contentTypeId}`)
  } catch (error) {
    // Check if error is due to usage limits or permissions
    const errorMessage = error instanceof Error ? error.message : String(error)
    const isUsageLimit =
      errorMessage.includes('usageExceeded') ||
      errorMessage.includes('Forbidden')

    if (isUsageLimit) {
      console.warn(
        `Cannot create component content type ${contentTypeId} due to Contentful limits. ` +
          `Assuming it exists or will be created manually. Continuing...`
      )
      // Don't throw - continue with the assumption content type exists
      return
    }

    console.error(
      `Failed to create component content type ${contentTypeId}:`,
      errorMessage
    )
    throw error
  }
}

/**
 * Creates Page content type if it doesn't exist.
 */
async function ensurePageContentType(
  environment: EnvironmentLike
): Promise<void> {
  const existing = await environment.getContentTypes()
  const exists = existing.items.some((ct) => ct.sys.id === PAGE_CONTENT_TYPE_ID)

  if (exists) {
    return
  }

  // Get all component type IDs for the reference field
  const componentTypeIds = Object.values(COMPONENT_TYPE_IDS)

  try {
    const ct = await environment.createContentTypeWithId(PAGE_CONTENT_TYPE_ID, {
      name: 'Page',
      displayField: 'internalName',
      fields: [
        {
          id: 'internalName',
          name: 'Internal Name',
          type: 'Symbol',
          required: true,
        },
        {
          id: 'slug',
          name: 'Slug',
          type: 'Symbol',
          required: true,
          validations: [{ unique: true }],
        },
        {
          id: 'components',
          name: 'Components',
          type: 'Array',
          items: {
            type: 'Link',
            linkType: 'Entry',
            validations: [
              {
                linkContentType: componentTypeIds,
              },
            ],
          },
          required: false,
        },
        {
          id: 'componentMapping',
          name: 'Component Mapping',
          type: 'Object',
          required: false,
        },
      ],
    })
    await ct.publish()
    console.log(`Created page content type: ${PAGE_CONTENT_TYPE_ID}`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const isUsageLimit =
      errorMessage.includes('usageExceeded') ||
      errorMessage.includes('Forbidden')

    if (isUsageLimit) {
      console.warn(
        `Cannot create page content type due to Contentful limits. ` +
          `Assuming it exists or will be created manually. Continuing...`
      )
      return
    }

    console.error(`Failed to create page content type:`, errorMessage)
    throw error
  }
}

/**
 * Creates GlobalSettings content type if it doesn't exist.
 */
async function ensureGlobalSettingsContentType(
  environment: EnvironmentLike
): Promise<void> {
  const existing = await environment.getContentTypes()
  const exists = existing.items.some(
    (ct) => ct.sys.id === GLOBAL_SETTINGS_CONTENT_TYPE_ID
  )

  if (exists) {
    return
  }

  try {
    const ct = await environment.createContentTypeWithId(
      GLOBAL_SETTINGS_CONTENT_TYPE_ID,
      {
        name: 'Global Settings',
        displayField: 'id',
        fields: [
          {
            id: 'id',
            name: 'ID',
            type: 'Symbol',
            required: true,
            validations: [{ unique: true }],
          },
          {
            id: 'data',
            name: 'Data',
            type: 'Object',
            required: false,
          },
        ],
      }
    )
    await ct.publish()
    console.log(
      `Created global settings content type: ${GLOBAL_SETTINGS_CONTENT_TYPE_ID}`
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const isUsageLimit =
      errorMessage.includes('usageExceeded') ||
      errorMessage.includes('Forbidden')

    if (isUsageLimit) {
      console.warn(
        `Cannot create global settings content type due to Contentful limits. ` +
          `Assuming it exists or will be created manually. Continuing...`
      )
      return
    }

    console.error(
      `Failed to create global settings content type:`,
      errorMessage
    )
    throw error
  }
}

/**
 * Creates or updates a component entry.
 * Returns the entry ID.
 * @param contentTypeCache - Map of content type IDs to their published status
 */
async function ensureComponentEntry(
  environment: EnvironmentLike,
  componentType: ComponentType,
  sectionKey: string,
  pageKey: string,
  data: Record<string, unknown>,
  contentTypeCache: Map<string, boolean>
): Promise<string> {
  const contentTypeId = COMPONENT_TYPE_IDS[componentType]

  // Check cache first, then content type if not cached
  let isPublished = contentTypeCache.get(contentTypeId)
  if (isPublished === undefined) {
    const contentTypes = await environment.getContentTypes()
    const contentType = contentTypes.items.find(
      (ct) => ct.sys.id === contentTypeId
    ) as { sys: { id: string; publishedAt?: string | null } } | undefined
    isPublished = Boolean(contentType?.sys.publishedAt)
    contentTypeCache.set(contentTypeId, isPublished)
  }

  if (!isPublished) {
    console.warn(
      `Component content type ${contentTypeId} does not exist or is not published. ` +
        `Skipping entry creation for ${pageKey}.${sectionKey}.`
    )
    // Return a placeholder ID - this will cause page entry creation to skip this component
    return `placeholder-${componentType}-${sectionKey}`
  }

  const preparedData = prepareComponentData(
    componentType,
    data,
    sectionKey,
    pageKey
  )
  const entryFields: Record<string, Record<string, unknown>> = {}

  for (const [key, value] of Object.entries(preparedData)) {
    if (
      componentType === 'RichText' &&
      key === 'content' &&
      isRichTextDocument(value)
    ) {
      entryFields.content = { [CONTENTFUL_LOCALE]: value }
    } else if (componentType === 'RichText' && key === 'title') {
      // Ensure title is set for RichText
      entryFields.title = { [CONTENTFUL_LOCALE]: value }
    } else if (
      (componentType === 'Benefits' && key === 'benefits') ||
      (componentType === 'FAQ' && key === 'questions') ||
      (componentType === 'Reviews' && key === 'reviews') ||
      (componentType === 'Features' && key === 'features') ||
      (componentType === 'HowItWorks' && key === 'steps') ||
      (componentType === 'TextBlock' && key === 'data')
    ) {
      // Store structured objects
      entryFields[key] = { [CONTENTFUL_LOCALE]: value }
    } else if (typeof value === 'string') {
      entryFields[key] = { [CONTENTFUL_LOCALE]: value }
    } else if (typeof value === 'object' && value !== null) {
      // Store complex objects
      entryFields[key] = { [CONTENTFUL_LOCALE]: value }
    }
  }

  // Check if entry already exists by querying all entries
  // We'll create new entries - Contentful will generate IDs
  // In a production system, you'd want to track entry IDs externally or use a unique identifier field
  try {
    const entry = await environment.createEntry(contentTypeId, {
      fields: entryFields,
    })
    await entry.publish()
    console.log(
      `Created component entry (${componentType}) for ${pageKey}.${sectionKey}`
    )
    return entry.sys.id
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    // If content type doesn't exist or is not activated, skip
    if (
      errorMessage.includes('could not be found') ||
      errorMessage.includes('not activated') ||
      errorMessage.includes('unknownContentType')
    ) {
      console.warn(
        `Cannot create component entry for ${pageKey}.${sectionKey} - content type not available. Skipping...`
      )
      return `placeholder-${componentType}-${sectionKey}`
    }

    // If entry creation fails, try to find existing entry
    // This is a simple approach - in production you'd want better deduplication
    console.warn(
      `Failed to create component entry for ${pageKey}.${sectionKey}, trying to find existing:`,
      errorMessage
    )

    // Try to find existing entries of this type
    try {
      const existing = await environment.getEntries({
        content_type: contentTypeId,
        limit: 1000,
      })
      // Return first entry ID as fallback (not ideal, but works for now)
      if (existing.items.length > 0) {
        console.log(
          `Using existing component entry for ${pageKey}.${sectionKey}`
        )
        return existing.items[0].sys.id
      }
    } catch {
      // Ignore
    }

    throw error
  }
}

/**
 * Creates or updates a Page entry.
 * @param contentTypeCache - Map of content type IDs to their published status
 */
async function ensurePageEntry(
  environment: EnvironmentLike,
  pageKey: string,
  slug: string,
  componentMappings: Array<{ sectionKey: string; componentEntryId: string }>,
  contentTypeCache: Map<string, boolean>
): Promise<void> {
  const entryId = `${pageKey.toLowerCase()}Page`.replace(/[^a-z0-9]/g, '')

  // Check cache first
  let pageContentTypeExists = contentTypeCache.get(PAGE_CONTENT_TYPE_ID)
  if (pageContentTypeExists === undefined) {
    const contentTypes = await environment.getContentTypes()
    pageContentTypeExists = contentTypes.items.some(
      (ct) =>
        ct.sys.id === PAGE_CONTENT_TYPE_ID &&
        Boolean(
          (ct as { sys: { id: string; publishedAt?: string | null } }).sys
            .publishedAt
        )
    )
    contentTypeCache.set(PAGE_CONTENT_TYPE_ID, pageContentTypeExists)
  }

  if (!pageContentTypeExists) {
    console.warn(
      `Page content type does not exist or is not published. Skipping page entry creation for ${pageKey}.`
    )
    return
  }

  // Filter out placeholder component IDs
  const validComponentMappings = componentMappings.filter(
    (m) => !m.componentEntryId.startsWith('placeholder-')
  )

  // Check if entry exists
  let existing
  try {
    existing = await environment.getEntries({
      content_type: PAGE_CONTENT_TYPE_ID,
      'fields.slug': slug,
      limit: 1,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('unknownContentType')) {
      console.warn(
        `Page content type not accessible. Skipping page entry creation for ${pageKey}.`
      )
      return
    }
    throw error
  }

  const componentEntryIds = validComponentMappings.map(
    (m) => m.componentEntryId
  )
  const componentMappingObj: Record<string, string> = {}
  for (const mapping of validComponentMappings) {
    componentMappingObj[mapping.sectionKey] = mapping.componentEntryId
  }

  const entryFields: Record<string, Record<string, unknown>> = {
    internalName: { [CONTENTFUL_LOCALE]: `${pageKey} Page` },
    slug: { [CONTENTFUL_LOCALE]: slug },
    components: {
      [CONTENTFUL_LOCALE]:
        componentEntryIds.length > 0
          ? componentEntryIds.map((id) => ({
              sys: { type: 'Link', linkType: 'Entry', id },
            }))
          : [],
    },
    componentMapping: {
      [CONTENTFUL_LOCALE]:
        Object.keys(componentMappingObj).length > 0 ? componentMappingObj : {},
    },
  }

  if (existing.items.length > 0) {
    const entry = existing.items[0]
    if (!entry.sys.publishedAt) {
      await entry.publish()
    }
    console.log(`Page entry exists: ${pageKey}`)
    return
  }

  try {
    const entry = await environment.createEntry(PAGE_CONTENT_TYPE_ID, {
      fields: entryFields,
    })
    await entry.publish()
    console.log(`Created page entry: ${pageKey} (${slug})`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)

    // If content type doesn't exist or is inaccessible, just warn and continue
    if (
      errorMessage.includes('unknownContentType') ||
      errorMessage.includes('could not be found') ||
      errorMessage.includes('not activated') ||
      errorMessage.includes('Forbidden')
    ) {
      console.warn(
        `Cannot create page entry for ${pageKey} due to Contentful limits or missing content type. Skipping...`
      )
      return
    }

    console.error(`Failed to create page entry ${entryId}:`, errorMessage)
    throw error
  }
}

/**
 * Creates or updates GlobalSettings entry.
 * @param contentTypeCache - Map of content type IDs to their published status
 */
async function ensureGlobalSettingsEntry(
  environment: EnvironmentLike,
  namespace: string,
  data: Record<string, unknown>,
  contentTypeCache: Map<string, boolean>
): Promise<void> {
  const entryId = `${namespace.toLowerCase()}GlobalSettings`.replace(
    /[^a-z0-9]/g,
    ''
  )

  // Check cache first
  let contentTypeExists = contentTypeCache.get(GLOBAL_SETTINGS_CONTENT_TYPE_ID)
  if (contentTypeExists === undefined) {
    const contentTypes = await environment.getContentTypes()
    contentTypeExists = contentTypes.items.some(
      (ct) => ct.sys.id === GLOBAL_SETTINGS_CONTENT_TYPE_ID
    )
    contentTypeCache.set(GLOBAL_SETTINGS_CONTENT_TYPE_ID, contentTypeExists)
  }

  if (!contentTypeExists) {
    console.warn(
      `GlobalSettings content type does not exist. Skipping entry creation for ${namespace}.`
    )
    return
  }

  // Check if entry exists
  let existing
  try {
    existing = await environment.getEntries({
      content_type: GLOBAL_SETTINGS_CONTENT_TYPE_ID,
      'sys.id': entryId,
      limit: 1,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('unknownContentType')) {
      console.warn(
        `GlobalSettings content type not accessible. Skipping entry creation for ${namespace}.`
      )
      return
    }
    throw error
  }

  const entryFields: Record<string, Record<string, unknown>> = {
    id: { [CONTENTFUL_LOCALE]: namespace },
    data: { [CONTENTFUL_LOCALE]: data },
  }

  if (existing.items.length > 0) {
    const entry = existing.items[0]
    if (!entry.sys.publishedAt) {
      await entry.publish()
    }
    console.log(`GlobalSettings entry exists: ${namespace}`)
    return
  }

  try {
    const entry = await environment.createEntry(
      GLOBAL_SETTINGS_CONTENT_TYPE_ID,
      {
        fields: entryFields,
      }
    )
    await entry.publish()
    console.log(`Created GlobalSettings entry: ${namespace}`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    // If content type doesn't exist or is inaccessible, just warn and continue
    if (
      errorMessage.includes('unknownContentType') ||
      errorMessage.includes('Forbidden')
    ) {
      console.warn(
        `Cannot create GlobalSettings entry for ${namespace} due to Contentful limits or missing content type. Skipping...`
      )
      return
    }
    console.error(
      `Failed to create GlobalSettings entry ${entryId}:`,
      errorMessage
    )
    throw error
  }
}

async function main() {
  console.log('Starting Contentful sync with component-based architecture...\n')

  const enJsonPath = resolve(process.cwd(), 'messages/en.json')
  const enJsonContent = readFileSync(enJsonPath, 'utf-8')
  const enJson = JSON.parse(enJsonContent) as Record<string, unknown>

  const environment = await getEnvironment()

  // Analyze en.json structure
  const { pages, globalContent } = analyzeEnJson(enJson)

  // Ensure all component content types exist (batch creation)
  console.log('Creating component content types...')
  const componentTypes: ComponentType[] = [
    'Hero',
    'Benefits',
    'FAQ',
    'Reviews',
    'Features',
    'HowItWorks',
    'TextBlock',
    'RichText',
  ]

  await processInBatches(
    componentTypes,
    async (componentType) => {
      await ensureComponentContentType(environment, componentType)
    },
    5, // Process 5 content types in parallel
    'Creating component content types'
  )

  // Ensure Page and GlobalSettings content types exist
  console.log('\nCreating Page and GlobalSettings content types...')
  await ensurePageContentType(environment)
  await ensureGlobalSettingsContentType(environment)

  // Cache content types to avoid repeated API calls
  const contentTypeCache = new Map<string, boolean>()
  const contentTypes = await environment.getContentTypes()
  for (const ct of contentTypes.items) {
    const contentType = ct as {
      sys: { id: string; publishedAt?: string | null }
    }
    contentTypeCache.set(
      contentType.sys.id,
      Boolean(contentType.sys.publishedAt)
    )
  }

  // Collect all component entries to create
  console.log('\nCreating component entries...')
  const componentEntriesToCreate: Array<{
    componentType: ComponentType
    sectionKey: string
    pageKey: string
    data: Record<string, unknown>
  }> = []

  for (const page of pages) {
    for (const component of page.components) {
      componentEntriesToCreate.push({
        componentType: component.componentType,
        sectionKey: component.sectionKey,
        pageKey: page.pageKey,
        data: component.data,
      })
    }
  }

  // Batch create component entries
  const BATCH_SIZE = 15 // Process 15 component entries in parallel
  const componentEntryMap = new Map<string, string>() // Maps pageKey.sectionKey -> entryId

  await processInBatches(
    componentEntriesToCreate,
    async (item) => {
      const entryId = await ensureComponentEntry(
        environment,
        item.componentType,
        item.sectionKey,
        item.pageKey,
        item.data,
        contentTypeCache
      )
      componentEntryMap.set(`${item.pageKey}.${item.sectionKey}`, entryId)
      return entryId
    },
    BATCH_SIZE,
    'Creating component entries'
  )

  // Create page entries with component mappings
  console.log('\nCreating page entries...')
  const pageEntriesToCreate = pages.map((page) => ({
    pageKey: page.pageKey,
    slug: page.slug,
    componentMappings: page.components
      .map((component) => ({
        sectionKey: component.sectionKey,
        componentEntryId:
          componentEntryMap.get(`${page.pageKey}.${component.sectionKey}`) ||
          `placeholder-${component.componentType}-${component.sectionKey}`,
      }))
      .filter((m) => !m.componentEntryId.startsWith('placeholder-')),
  }))

  await processInBatches(
    pageEntriesToCreate,
    async (item) => {
      await ensurePageEntry(
        environment,
        item.pageKey,
        item.slug,
        item.componentMappings,
        contentTypeCache
      )
    },
    BATCH_SIZE,
    'Creating page entries'
  )

  // Batch create GlobalSettings entries
  console.log('\nCreating GlobalSettings entries...')
  await processInBatches(
    globalContent,
    async (global) => {
      await ensureGlobalSettingsEntry(
        environment,
        global.namespace,
        global.data,
        contentTypeCache
      )
    },
    BATCH_SIZE,
    'Creating GlobalSettings entries'
  )

  console.log('\nSync complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
