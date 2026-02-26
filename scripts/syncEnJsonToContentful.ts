/**
 * Syncs en.json structure to Contentful using Page / Section / RichTextPage model:
 * - Section: one node of the en.json tree (key, name, sections, copy1-copy45, contentKeyMapping).
 *   Content keys are mapped to copy1-copy45 in component order (from sectionContentKeyOrder.json);
 *   contentKeyMapping stores the key->slot mapping. Falls back to alphabetical when no order exists.
 * - Page: app page with key and sections (no slug).
 * - RichTextPage: Privacy Policy and Terms & Conditions (key + rich text content).
 *
 * Requires: CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN in env.
 * Run: yarn contentful:sync
 */

import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import { resolve } from 'path'

import contentfulManagement from 'contentful-management'
import { config } from 'dotenv'

import { getSyncEnvironmentId } from '@/scripts/contentful/getEnvironment'

/** Section content key order from components (run sectionContentKeyOrder.ts to regenerate). */
const SECTION_KEY_ORDER: Record<string, string[]> = (() => {
  try {
    const p = resolve(process.cwd(), 'scripts/sectionContentKeyOrder.json')
    return JSON.parse(readFileSync(p, 'utf-8')) as Record<string, string[]>
  } catch {
    return {}
  }
})()

config({ path: '.env.local' })

const CONTENTFUL_LOCALE = 'en-US'
const ENVIRONMENT_ID = getSyncEnvironmentId()

/** Contentful entry IDs must be ≤64 characters. */
const CONTENTFUL_MAX_ENTRY_ID_LENGTH = 64

const SECTION_CONTENT_TYPE_ID = 'section'
const PAGE_CONTENT_TYPE_ID = 'page'
const RICH_TEXT_PAGE_CONTENT_TYPE_ID = 'richTextPage'
const FEATURE_FLAG_CONTENT_TYPE_ID = 'featureFlag'

/** Feature flags to ensure exist when syncing. Default enabled: true. */
const FEATURE_FLAGS_TO_SYNC: Array<{ key: string; enabled: boolean }> = [
  { key: 'LambEnabled', enabled: false },
  { key: 'PancreaticEnabled', enabled: false },
  { key: 'waitlistFlip', enabled: true },
]

const PAGE_KEYS = [
  'Home',
  'About',
  'BlogIndex',
  'BlogPostPage',
  'Quiz',
  'Formulation',
  'Profile',
] as const

const RICH_TEXT_PAGE_KEYS = ['PrivacyPolicy', 'TermsAndConditions'] as const

function isRichTextDocument(
  value: unknown
): value is { nodeType: string; content?: unknown[] } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'nodeType' in value &&
    (value as { nodeType: string }).nodeType === 'document'
  )
}

/**
 * Derives a recognizable display name from an en.json key (e.g. "ChangePasswordModal" → "Change Password Modal").
 */
function keyToName(key: string): string {
  const withSpaces = key.replace(/([A-Z])/g, ' $1').trim()
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1).toLowerCase()
}

/**
 * Builds a stable entry ID from the key path (e.g. ["Home", "Hero"] → "homeHero").
 * When the ID exceeds Contentful's 64-char limit, truncates and appends an 8-char
 * hash of the full path to ensure uniqueness.
 */
function keyPathToEntryId(path: string[]): string {
  const base =
    path
      .map((p) => p.replace(/([A-Z])/g, (m) => m.toLowerCase()))
      .join('')
      .replace(/[^a-z0-9]/g, '') || 'section'

  if (base.length <= CONTENTFUL_MAX_ENTRY_ID_LENGTH) {
    return base
  }

  const hash = createHash('md5')
    .update(path.join('.'))
    .digest('hex')
    .slice(0, 8)
  const truncated = base.slice(0, CONTENTFUL_MAX_ENTRY_ID_LENGTH - hash.length)
  return truncated + hash
}

/** Keys we skip syncing to Contentful (a11y: aria, alt, etc.). */
function isA11yKey(key: string): boolean {
  const lower = key.toLowerCase()
  return (
    lower.includes('aria') || lower.includes('alt') || lower.includes('a11y')
  )
}

/**
 * Returns content keys in component order when available, else alphabetical.
 * Ensures all keys in contentKeys are included (config order first, extras appended).
 */
function getOrderedContentKeys(
  path: string[],
  contentKeys: string[]
): string[] {
  const pathKey = path.join('.')
  const ordered = SECTION_KEY_ORDER[pathKey]
  if (!ordered) return [...contentKeys].sort()
  const seen = new Set<string>()
  const result: string[] = []
  for (const k of ordered) {
    if (contentKeys.includes(k) && !seen.has(k)) {
      seen.add(k)
      result.push(k)
    }
  }
  for (const k of contentKeys) {
    if (!seen.has(k)) result.push(k)
  }
  return result
}

const SECTION_TAG_ROOT = 'root'

/** Number of generic copy fields (Copy 1 through Copy 45). */
const COPY_FIELD_COUNT = 45

interface EnvironmentLike {
  getContentTypes(): Promise<{
    items: Array<{ sys: { id: string; publishedAt?: string | null } }>
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
  getEntry(entryId: string): Promise<{
    fields: Record<string, Record<string, unknown>>
    update(): Promise<{
      publish(): Promise<unknown>
    }>
  }>
  createEntry(
    contentTypeId: string,
    data: { fields: Record<string, Record<string, unknown>> }
  ): Promise<{ sys: { id: string }; publish(): Promise<unknown> }>
  createEntryWithId(
    contentTypeId: string,
    id: string,
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
  return space.getEnvironment(ENVIRONMENT_ID) as Promise<EnvironmentLike>
}

/** Builds Section content type fields: key, name, sections, copy1-copy45, contentKeyMapping, sectionTag. */
function buildSectionContentTypeFields(): Array<Record<string, unknown>> {
  const copyFields: Array<Record<string, unknown>> = []
  for (let i = 1; i <= COPY_FIELD_COUNT; i++) {
    copyFields.push({
      id: `copy${i}`,
      name: `Copy ${i}`,
      type: 'Text',
      required: false,
    })
  }
  return [
    { id: 'key', name: 'Key', type: 'Symbol', required: true },
    { id: 'name', name: 'Name', type: 'Symbol', required: true },
    {
      id: 'sections',
      name: 'Sections',
      type: 'Array',
      required: false,
      items: {
        type: 'Link',
        linkType: 'Entry',
        validations: [{ linkContentType: [SECTION_CONTENT_TYPE_ID] }],
      },
    },
    ...copyFields,
    {
      id: 'contentKeyMapping',
      name: 'Content Key Mapping',
      type: 'Object',
      required: false,
    },
    {
      id: 'sectionTag',
      name: 'Section Tag',
      type: 'Symbol',
      required: false,
    },
  ]
}

async function ensureSectionContentType(
  environment: EnvironmentLike
): Promise<void> {
  const existing = await environment.getContentTypes()
  const sectionCt = existing.items.find(
    (ct) => ct.sys.id === SECTION_CONTENT_TYPE_ID
  )
  if (sectionCt) {
    const env = environment as unknown as {
      getContentType(id: string): Promise<{
        fields: Array<{ id: string }>
        update(): Promise<unknown>
        publish(): Promise<unknown>
      }>
    }
    if (typeof env.getContentType === 'function') {
      const ct = await env.getContentType(SECTION_CONTENT_TYPE_ID)
      const hasCopy1 = ct.fields.some((f) => f.id === 'copy1')
      const hasContentKeyMapping = ct.fields.some(
        (f) => f.id === 'contentKeyMapping'
      )
      if (!hasCopy1 || !hasContentKeyMapping) {
        const baseFields = (ct.fields as Array<{ id: string }>).filter(
          (f) =>
            f.id !== 'content' &&
            !f.id.startsWith('copy') &&
            f.id !== 'contentKeyMapping'
        )
        const copyFields = buildSectionContentTypeFields().filter(
          (f) =>
            (f.id as string).startsWith('copy') || f.id === 'contentKeyMapping'
        )
        const sectionsField = baseFields.filter((f) => f.id === 'sections')
        const keyNameFields = baseFields.filter(
          (f) => f.id === 'key' || f.id === 'name'
        )
        const restFields = baseFields.filter(
          (f) => f.id !== 'key' && f.id !== 'name' && f.id !== 'sections'
        )
        ;(ct.fields as unknown[]) = [
          ...keyNameFields,
          ...sectionsField,
          ...copyFields,
          ...restFields,
        ]
        await ct.update()
        await ct.publish()
        console.log(
          `Migrated Section content type: added copy1-copy${COPY_FIELD_COUNT} and contentKeyMapping`
        )
      }
    }
    return
  }

  const ct = await environment.createContentTypeWithId(
    SECTION_CONTENT_TYPE_ID,
    {
      name: 'Section',
      displayField: 'name',
      fields: buildSectionContentTypeFields(),
    }
  )
  await ct.publish()
  console.log(`Created content type: ${SECTION_CONTENT_TYPE_ID}`)
}

async function ensurePageContentType(
  environment: EnvironmentLike
): Promise<void> {
  const existing = await environment.getContentTypes()
  const exists = existing.items.some((ct) => ct.sys.id === PAGE_CONTENT_TYPE_ID)
  if (exists) return

  const ct = await environment.createContentTypeWithId(PAGE_CONTENT_TYPE_ID, {
    name: 'Page',
    displayField: 'key',
    fields: [
      { id: 'key', name: 'Key', type: 'Symbol', required: true },
      {
        id: 'sections',
        name: 'Sections',
        type: 'Array',
        items: {
          type: 'Link',
          linkType: 'Entry',
          validations: [{ linkContentType: [SECTION_CONTENT_TYPE_ID] }],
        },
        required: false,
      },
    ],
  })
  await ct.publish()
  console.log(`Created content type: ${PAGE_CONTENT_TYPE_ID}`)
}

async function ensureRichTextPageContentType(
  environment: EnvironmentLike
): Promise<void> {
  const existing = await environment.getContentTypes()
  const exists = existing.items.some(
    (ct) => ct.sys.id === RICH_TEXT_PAGE_CONTENT_TYPE_ID
  )
  if (exists) return

  const ct = await environment.createContentTypeWithId(
    RICH_TEXT_PAGE_CONTENT_TYPE_ID,
    {
      name: 'Rich Text Page',
      displayField: 'key',
      fields: [
        { id: 'key', name: 'Key', type: 'Symbol', required: true },
        { id: 'content', name: 'Content', type: 'RichText', required: false },
        {
          id: 'heroSection',
          name: 'Hero Section',
          type: 'Link',
          linkType: 'Entry',
          validations: [{ linkContentType: [SECTION_CONTENT_TYPE_ID] }],
          required: false,
        },
      ],
    }
  )
  await ct.publish()
  console.log(`Created content type: ${RICH_TEXT_PAGE_CONTENT_TYPE_ID}`)
}

async function ensureFeatureFlagContentType(
  environment: EnvironmentLike
): Promise<void> {
  const existing = await environment.getContentTypes()
  const exists = existing.items.some(
    (ct) => ct.sys.id === FEATURE_FLAG_CONTENT_TYPE_ID
  )
  if (exists) return

  const ct = await environment.createContentTypeWithId(
    FEATURE_FLAG_CONTENT_TYPE_ID,
    {
      name: 'Feature Flag',
      displayField: 'key',
      fields: [
        { id: 'key', name: 'Key', type: 'Symbol', required: true },
        { id: 'enabled', name: 'Enabled', type: 'Boolean', required: true },
      ],
    }
  )
  await ct.publish()
  console.log(`Created content type: ${FEATURE_FLAG_CONTENT_TYPE_ID}`)
}

async function ensureFeatureFlagEntry(
  environment: EnvironmentLike,
  key: string,
  enabled: boolean
): Promise<void> {
  const entryId = key.toLowerCase().replace(/[^a-z0-9]/g, '') + 'flag'

  const existing = await environment.getEntries({
    content_type: FEATURE_FLAG_CONTENT_TYPE_ID,
    'fields.key': key,
    limit: 1,
  })

  const fields: Record<string, Record<string, unknown>> = {
    key: { [CONTENTFUL_LOCALE]: key },
    enabled: { [CONTENTFUL_LOCALE]: enabled },
  }

  if (existing.items.length > 0) {
    const entry = await environment.getEntry(existing.items[0].sys.id)
    entry.fields.key = { [CONTENTFUL_LOCALE]: key }
    entry.fields.enabled = { [CONTENTFUL_LOCALE]: enabled }
    const updated = await entry.update()
    await updated.publish()
    console.log(`Updated feature flag: ${key} (enabled: ${enabled})`)
    return
  }

  const entry = await environment.createEntryWithId(
    FEATURE_FLAG_CONTENT_TYPE_ID,
    entryId,
    { fields }
  )
  await entry.publish()
  console.log(`Created feature flag: ${key} (enabled: ${enabled})`)
}

/**
 * Recursively creates Section entries from an en.json object. Skips rich text document under PrivacyPolicy.content / TermsAndConditions.content.
 * Returns the entry ID of the created section, or null if this node should be skipped.
 */
async function createSectionFromObject(
  environment: EnvironmentLike,
  key: string,
  obj: Record<string, unknown>,
  path: string[],
  parentKeyForRichText: string | null
): Promise<string | null> {
  const content: Record<string, string> = {}
  const childKeys: string[] = []
  const sectionLinks: {
    sys: { type: 'Link'; linkType: 'Entry'; id: string }
  }[] = []

  for (const [k, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue
    if (isA11yKey(k)) continue
    if (typeof value === 'string') {
      content[k] = value
      continue
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      content[k] = String(value)
      continue
    }
    if (Array.isArray(value)) {
      content[k] = JSON.stringify(value)
      continue
    }
    if (typeof value === 'object') {
      if (
        parentKeyForRichText &&
        k === 'content' &&
        isRichTextDocument(value)
      ) {
        continue
      }
      childKeys.push(k)
    }
  }

  const childIds: (string | null)[] = []
  for (const childKey of childKeys) {
    const childValue = obj[childKey]
    if (typeof childValue !== 'object' || childValue === null) continue
    const childPath = [...path, childKey]
    const childId = await createSectionFromObject(
      environment,
      childKey,
      childValue as Record<string, unknown>,
      childPath,
      parentKeyForRichText
    )
    childIds.push(childId)
  }

  for (const id of childIds) {
    if (id) sectionLinks.push({ sys: { type: 'Link', linkType: 'Entry', id } })
  }

  const entryId = keyPathToEntryId(path)
  const name = keyToName(key)
  const isRootSection = path.length === 1

  const contentKeys = Object.keys(content)
  const sortedKeys = getOrderedContentKeys(path, contentKeys)
  const contentKeyMapping: Record<string, string> = {}
  const copyFields: Record<string, Record<string, unknown>> = {}
  for (let i = 0; i < sortedKeys.length && i < COPY_FIELD_COUNT; i++) {
    const copyId = `copy${i + 1}`
    contentKeyMapping[copyId] = sortedKeys[i]
    copyFields[copyId] = { [CONTENTFUL_LOCALE]: content[sortedKeys[i]] }
  }

  const fields: Record<string, Record<string, unknown>> = {
    key: { [CONTENTFUL_LOCALE]: key },
    name: { [CONTENTFUL_LOCALE]: name },
    ...copyFields,
    contentKeyMapping: { [CONTENTFUL_LOCALE]: contentKeyMapping },
    sections: {
      [CONTENTFUL_LOCALE]: sectionLinks.map((link) => ({ sys: link.sys })),
    },
    ...(isRootSection && {
      sectionTag: { [CONTENTFUL_LOCALE]: SECTION_TAG_ROOT },
    }),
  }

  try {
    const existing = await environment.getEntries({
      content_type: SECTION_CONTENT_TYPE_ID,
      'sys.id': entryId,
      limit: 1,
    })

    if (existing.items.length > 0) {
      const entry = await environment.getEntry(entryId)
      entry.fields.key = { [CONTENTFUL_LOCALE]: key }
      entry.fields.name = { [CONTENTFUL_LOCALE]: name }
      for (const [copyId, value] of Object.entries(copyFields)) {
        entry.fields[copyId] = value
      }
      entry.fields.contentKeyMapping = {
        [CONTENTFUL_LOCALE]: contentKeyMapping,
      }
      entry.fields.sections = {
        [CONTENTFUL_LOCALE]: sectionLinks.map((link) => ({ sys: link.sys })),
      }
      if (isRootSection) {
        entry.fields.sectionTag = {
          [CONTENTFUL_LOCALE]: SECTION_TAG_ROOT,
        }
      }
      const updated = await entry.update()
      await updated.publish()
      console.log(`Updated section: ${path.join('.')} (${name})`)
      return entryId
    }

    const entry = await environment.createEntryWithId(
      SECTION_CONTENT_TYPE_ID,
      entryId,
      { fields }
    )
    await entry.publish()
    console.log(`Created section: ${path.join('.')} (${name})`)
    return entryId
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`Failed to create section ${path.join('.')}:`, msg)
    throw err
  }
}

async function createRichTextPageEntry(
  environment: EnvironmentLike,
  key: string,
  content: unknown
): Promise<void> {
  const entryId = key.toLowerCase().replace(/[^a-z0-9]/g, '') + 'richtext'

  const existing = await environment.getEntries({
    content_type: RICH_TEXT_PAGE_CONTENT_TYPE_ID,
    'sys.id': entryId,
    limit: 1,
  })

  const fields: Record<string, Record<string, unknown>> = {
    key: { [CONTENTFUL_LOCALE]: key },
    content: { [CONTENTFUL_LOCALE]: content },
  }

  if (existing.items.length > 0) {
    console.log(`RichTextPage entry exists: ${key}`)
    return
  }

  const entry = await environment.createEntryWithId(
    RICH_TEXT_PAGE_CONTENT_TYPE_ID,
    entryId,
    { fields }
  )
  await entry.publish()
  console.log(`Created RichTextPage: ${key}`)
}

async function createPageEntry(
  environment: EnvironmentLike,
  pageKey: string,
  sectionEntryId: string | null
): Promise<void> {
  const entryId = pageKey.toLowerCase().replace(/[^a-z0-9]/g, '') + 'page'

  const existing = await environment.getEntries({
    content_type: PAGE_CONTENT_TYPE_ID,
    'fields.key': pageKey,
    limit: 1,
  })

  const sectionLink =
    sectionEntryId !== null
      ? [{ sys: { type: 'Link', linkType: 'Entry', id: sectionEntryId } }]
      : []

  const fields: Record<string, Record<string, unknown>> = {
    key: { [CONTENTFUL_LOCALE]: pageKey },
    sections: {
      [CONTENTFUL_LOCALE]: sectionLink.map((link) => ({ sys: link.sys })),
    },
  }

  if (existing.items.length > 0) {
    console.log(`Page entry exists: ${pageKey}`)
    return
  }

  const entry = await environment.createEntryWithId(
    PAGE_CONTENT_TYPE_ID,
    entryId,
    { fields }
  )
  await entry.publish()
  console.log(`Created page: ${pageKey}`)
}

async function main(): Promise<void> {
  console.log(
    `Starting Contentful sync (Page / Section / RichTextPage model) ` +
      `[environment: ${ENVIRONMENT_ID}]...\n`
  )

  const enJsonPath = resolve(process.cwd(), 'messages/en.json')
  const enJsonContent = readFileSync(enJsonPath, 'utf-8')
  const enJson = JSON.parse(enJsonContent) as Record<string, unknown>

  const environment = await getEnvironment()

  console.log('Creating content types...')
  await ensureSectionContentType(environment)
  await ensurePageContentType(environment)
  await ensureRichTextPageContentType(environment)
  await ensureFeatureFlagContentType(environment)

  const rootSectionIds = new Map<string, string>()

  console.log('\nCreating Section entries from en.json...')
  for (const rootKey of Object.keys(enJson)) {
    const value = enJson[rootKey]
    if (typeof value !== 'object' || value === null) continue

    const isRichTextRoot = (RICH_TEXT_PAGE_KEYS as readonly string[]).includes(
      rootKey
    )
    const parentKeyForRichText = isRichTextRoot ? rootKey : null

    const entryId = await createSectionFromObject(
      environment,
      rootKey,
      value as Record<string, unknown>,
      [rootKey],
      parentKeyForRichText
    )
    if (entryId) rootSectionIds.set(rootKey, entryId)
  }

  console.log('\nCreating RichTextPage entries...')
  for (const key of RICH_TEXT_PAGE_KEYS) {
    const root = enJson[key]
    if (typeof root !== 'object' || root === null) continue
    const content = (root as Record<string, unknown>).content
    if (!content || !isRichTextDocument(content)) continue
    await createRichTextPageEntry(environment, key, content)
  }

  console.log('\nCreating Page entries...')
  for (const pageKey of PAGE_KEYS) {
    const sectionId = rootSectionIds.get(pageKey) ?? null
    await createPageEntry(environment, pageKey, sectionId)
  }

  console.log('\nCreating feature flags...')
  for (const flag of FEATURE_FLAGS_TO_SYNC) {
    await ensureFeatureFlagEntry(environment, flag.key, flag.enabled)
  }

  console.log('\nSync complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
