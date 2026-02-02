/**
 * Syncs en.json structure to Contentful: creates content types (copy,
 * richTextCopy, quizBreedOption, expert, expertsSection) and populates copy
 * and richTextCopy entries from messages/en.json. Excludes Profile namespace.
 *
 * Requires: CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN in env.
 * Run: npx ts-node --esm scripts/syncEnJsonToContentful.ts
 * Or: node --loader ts-node/esm scripts/syncEnJsonToContentful.ts
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

import { createClient } from 'contentful-management'

const CONTENTFUL_LOCALE = 'en-US'
const ENVIRONMENT_ID = 'master'
const COPY_CONTENT_TYPE_ID = 'copy'
const RICH_TEXT_COPY_CONTENT_TYPE_ID = 'richTextCopy'
const QUIZ_BREED_OPTION_CONTENT_TYPE_ID = 'quizBreedOption'
const EXPERT_CONTENT_TYPE_ID = 'expert'
const EXPERTS_SECTION_CONTENT_TYPE_ID = 'expertsSection'

type EnJson = Record<string, unknown>

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

function flattenMessages(
  obj: EnJson,
  prefix = '',
  excludePrefix = 'Profile'
): { copy: Record<string, string>; richText: Record<string, unknown> } {
  const copy: Record<string, string> = {}
  const richText: Record<string, unknown> = {}

  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (fullKey === excludePrefix || fullKey.startsWith(`${excludePrefix}.`)) {
      continue
    }
    const value = obj[key]

    if (value === null || value === undefined) {
      continue
    }

    if (typeof value === 'string') {
      copy[fullKey] = value
      continue
    }
    if (typeof value === 'number') {
      copy[fullKey] = String(value)
      continue
    }
    if (typeof value === 'boolean') {
      copy[fullKey] = value ? 'true' : 'false'
      continue
    }

    if (Array.isArray(value)) {
      continue
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      if (isRichTextDocument(value)) {
        richText[fullKey] = value
        continue
      }
      const nested = flattenMessages(value as EnJson, fullKey, excludePrefix)
      Object.assign(copy, nested.copy)
      Object.assign(richText, nested.richText)
    }
  }

  return { copy, richText }
}

interface EnvironmentLike {
  getContentTypes(): Promise<{ items: Array<{ sys: { id: string } }> }>
  createContentTypeWithId(
    id: string,
    data: Record<string, unknown>
  ): Promise<{ publish(): Promise<unknown> }>
  getEntries(query: Record<string, unknown>): Promise<{
    items: Array<{ fields: Record<string, unknown> }>
  }>
  createEntry(
    contentTypeId: string,
    data: { fields: Record<string, Record<string, unknown>> }
  ): Promise<unknown>
}

async function ensureContentTypes(environment: EnvironmentLike) {
  const existing = await environment.getContentTypes()
  const ids = new Set(
    existing.items.map((ct: { sys: { id: string } }) => ct.sys.id)
  )

  if (!ids.has(COPY_CONTENT_TYPE_ID)) {
    const ct = await environment.createContentTypeWithId(COPY_CONTENT_TYPE_ID, {
      name: 'Copy',
      displayField: 'key',
      fields: [
        { id: 'key', name: 'Key', type: 'Symbol', required: true },
        { id: 'value', name: 'Value', type: 'Text', required: false },
      ],
    })
    await ct.publish()
    console.log(`Created content type: ${COPY_CONTENT_TYPE_ID}`)
  }

  if (!ids.has(RICH_TEXT_COPY_CONTENT_TYPE_ID)) {
    const ct = await environment.createContentTypeWithId(
      RICH_TEXT_COPY_CONTENT_TYPE_ID,
      {
        name: 'Rich Text Copy',
        displayField: 'key',
        fields: [
          { id: 'key', name: 'Key', type: 'Symbol', required: true },
          { id: 'content', name: 'Content', type: 'RichText', required: false },
        ],
      }
    )
    await ct.publish()
    console.log(`Created content type: ${RICH_TEXT_COPY_CONTENT_TYPE_ID}`)
  }

  if (!ids.has(QUIZ_BREED_OPTION_CONTENT_TYPE_ID)) {
    const ct = await environment.createContentTypeWithId(
      QUIZ_BREED_OPTION_CONTENT_TYPE_ID,
      {
        name: 'Quiz Breed Option',
        displayField: 'label',
        fields: [
          { id: 'value', name: 'Value', type: 'Symbol', required: true },
          { id: 'label', name: 'Label', type: 'Symbol', required: true },
          { id: 'category', name: 'Category', type: 'Symbol', required: false },
        ],
      }
    )
    await ct.publish()
    console.log(`Created content type: ${QUIZ_BREED_OPTION_CONTENT_TYPE_ID}`)
  }

  if (!ids.has(EXPERT_CONTENT_TYPE_ID)) {
    const ct = await environment.createContentTypeWithId(
      EXPERT_CONTENT_TYPE_ID,
      {
        name: 'Expert',
        displayField: 'name',
        fields: [
          { id: 'name', name: 'Name', type: 'Symbol', required: true },
          {
            id: 'description',
            name: 'Description',
            type: 'Text',
            required: false,
          },
          {
            id: 'imageAlt',
            name: 'Image Alt',
            type: 'Symbol',
            required: false,
          },
          {
            id: 'image',
            name: 'Image',
            type: 'Link',
            linkType: 'Asset',
            required: false,
          },
          {
            id: 'imageUrl',
            name: 'Image URL',
            type: 'Symbol',
            required: false,
          },
        ],
      }
    )
    await ct.publish()
    console.log(`Created content type: ${EXPERT_CONTENT_TYPE_ID}`)
  }

  if (!ids.has(EXPERTS_SECTION_CONTENT_TYPE_ID)) {
    const ct = await environment.createContentTypeWithId(
      EXPERTS_SECTION_CONTENT_TYPE_ID,
      {
        name: 'Experts Section',
        displayField: 'title',
        fields: [
          { id: 'title', name: 'Title', type: 'Symbol', required: false },
          {
            id: 'ecvcnParagraph1',
            name: 'ECVCN Paragraph 1',
            type: 'Symbol',
            required: false,
          },
          {
            id: 'ecvcnParagraph2',
            name: 'ECVCN Paragraph 2',
            type: 'Symbol',
            required: false,
          },
          {
            id: 'ecvcnParagraph3',
            name: 'ECVCN Paragraph 3',
            type: 'Symbol',
            required: false,
          },
          {
            id: 'experts',
            name: 'Experts',
            type: 'Array',
            items: { type: 'Link', linkType: 'Entry' },
            required: false,
          },
        ],
      }
    )
    await ct.publish()
    console.log(`Created content type: ${EXPERTS_SECTION_CONTENT_TYPE_ID}`)
  }
}

async function getEnvironment(): Promise<EnvironmentLike> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN
  if (!spaceId || !managementToken) {
    throw new Error(
      'CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN must be set'
    )
  }
  const client = createClient({ accessToken: managementToken }) as {
    getSpace(id: string): Promise<{
      getEnvironment(id: string): Promise<EnvironmentLike>
    }>
  }
  const space = await client.getSpace(spaceId)
  return space.getEnvironment(ENVIRONMENT_ID)
}

async function main() {
  const enPath = resolve(process.cwd(), 'messages/en.json')
  const enJson = JSON.parse(readFileSync(enPath, 'utf-8')) as EnJson

  const { copy, richText } = flattenMessages(enJson)

  const environment = await getEnvironment()

  const contentTypes = await environment.getContentTypes()
  const typeIds = new Set(contentTypes.items.map((ct) => ct.sys.id))

  if (
    !typeIds.has(COPY_CONTENT_TYPE_ID) ||
    !typeIds.has(RICH_TEXT_COPY_CONTENT_TYPE_ID)
  ) {
    await ensureContentTypes(environment)
  }

  const copyEntries = await environment.getEntries({
    content_type: COPY_CONTENT_TYPE_ID,
    limit: 1000,
  })
  const existingCopyKeys = new Set(
    copyEntries.items.map((e) => {
      const keyField = e.fields.key as Record<string, string> | undefined
      return keyField?.[CONTENTFUL_LOCALE] ?? keyField?.['en-US']
    })
  )

  let created = 0
  for (const [key, value] of Object.entries(copy)) {
    if (existingCopyKeys.has(key)) continue
    await environment.createEntry(COPY_CONTENT_TYPE_ID, {
      fields: {
        key: { 'en-US': key },
        value: { 'en-US': value },
      },
    })
    created++
    if (created % 50 === 0) console.log(`Copy entries created: ${created}`)
  }
  console.log(`Copy entries created: ${created} total`)

  const richTextEntries = await environment.getEntries({
    content_type: RICH_TEXT_COPY_CONTENT_TYPE_ID,
    limit: 100,
  })
  const existingRichKeys = new Set(
    richTextEntries.items.map((e) => {
      const keyField = e.fields.key as Record<string, string> | undefined
      return keyField?.[CONTENTFUL_LOCALE] ?? keyField?.['en-US']
    })
  )

  for (const [key, doc] of Object.entries(richText)) {
    if (existingRichKeys.has(key)) continue
    const docObj = doc as Record<string, unknown>
    await environment.createEntry(RICH_TEXT_COPY_CONTENT_TYPE_ID, {
      fields: {
        key: { 'en-US': key },
        content: { 'en-US': docObj },
      },
    })
    console.log(`Rich text entry created: ${key}`)
  }

  console.log('Sync complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
