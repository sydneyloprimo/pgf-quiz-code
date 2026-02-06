/**
 * Syncs en.json structure to Contentful using Page / Section / RichTextPage model:
 * - Section: one node of the en.json tree (key, name, content, sections).
 * - Page: app page with key and sections (no slug).
 * - RichTextPage: Privacy Policy and Terms & Conditions (key + rich text content).
 *
 * Requires: CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN in env.
 * Run: yarn contentful:sync
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

import contentfulManagement from 'contentful-management'
import { config } from 'dotenv'

config({ path: '.env.local' })

const CONTENTFUL_LOCALE = 'en-US'
const ENVIRONMENT_ID = 'master'

const SECTION_CONTENT_TYPE_ID = 'section'
const PAGE_CONTENT_TYPE_ID = 'page'
const RICH_TEXT_PAGE_CONTENT_TYPE_ID = 'richTextPage'

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
 */
function keyPathToEntryId(path: string[]): string {
  return (
    path
      .map((p) => p.replace(/([A-Z])/g, (m) => m.toLowerCase()))
      .join('')
      .replace(/[^a-z0-9]/g, '') || 'section'
  )
}

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

async function ensureSectionContentType(
  environment: EnvironmentLike
): Promise<void> {
  const existing = await environment.getContentTypes()
  const exists = existing.items.some(
    (ct) => ct.sys.id === SECTION_CONTENT_TYPE_ID
  )
  if (exists) return

  const ct = await environment.createContentTypeWithId(
    SECTION_CONTENT_TYPE_ID,
    {
      name: 'Section',
      displayField: 'name',
      fields: [
        { id: 'key', name: 'Key', type: 'Symbol', required: true },
        { id: 'name', name: 'Name', type: 'Symbol', required: true },
        { id: 'content', name: 'Content', type: 'Object', required: false },
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
  const fields: Record<string, Record<string, unknown>> = {
    key: { [CONTENTFUL_LOCALE]: key },
    name: { [CONTENTFUL_LOCALE]: name },
    content: { [CONTENTFUL_LOCALE]: content },
    sections: {
      [CONTENTFUL_LOCALE]: sectionLinks.map((link) => ({ sys: link.sys })),
    },
  }

  try {
    const existing = await environment.getEntries({
      content_type: SECTION_CONTENT_TYPE_ID,
      'sys.id': entryId,
      limit: 1,
    })

    if (existing.items.length > 0) {
      console.log(`Section entry exists: ${path.join('.')}`)
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
    'Starting Contentful sync (Page / Section / RichTextPage model)...\n'
  )

  const enJsonPath = resolve(process.cwd(), 'messages/en.json')
  const enJsonContent = readFileSync(enJsonPath, 'utf-8')
  const enJson = JSON.parse(enJsonContent) as Record<string, unknown>

  const environment = await getEnvironment()

  console.log('Creating content types...')
  await ensureSectionContentType(environment)
  await ensurePageContentType(environment)
  await ensureRichTextPageContentType(environment)

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

  console.log('\nSync complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
