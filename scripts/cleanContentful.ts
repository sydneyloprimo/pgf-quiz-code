/**
 * Cleans all Contentful content: deletes all entries and content types.
 * This completely clears the Contentful space.
 *
 * Requires: CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN in env.
 * Run: yarn contentful:clean
 */

import contentfulManagement from 'contentful-management'
import { config } from 'dotenv'

import { getSyncEnvironmentId } from '@/scripts/contentful/getEnvironment'

config({ path: '.env.local' })

const CONTENTFUL_LOCALE = 'en-US'
const ENVIRONMENT_ID = getSyncEnvironmentId()

interface EntryLike {
  fields: Record<string, unknown>
  sys: { id: string; publishedAt?: string | null }
  unpublish(): Promise<unknown>
  delete(): Promise<unknown>
}

interface ContentTypeLike {
  sys: { id: string; publishedAt?: string | null }
  unpublish(): Promise<unknown>
  delete(): Promise<unknown>
}

interface EnvironmentLike {
  getContentTypes(): Promise<{
    items: Array<{
      sys: { id: string; publishedAt?: string | null }
      unpublish(): Promise<unknown>
      delete(): Promise<unknown>
    }>
  }>
  getEntries(query: Record<string, unknown>): Promise<{
    items: EntryLike[]
    total?: number
  }>
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
  }) as {
    getSpace(id: string): Promise<{
      getEnvironment(id: string): Promise<EnvironmentLike>
    }>
  }
  const space = await client.getSpace(spaceId)
  return space.getEnvironment(ENVIRONMENT_ID)
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
    const batchResults = await Promise.all(
      batch.map((item) =>
        processor(item).catch((error) => {
          console.error(
            `${label ? `${label}: ` : ''}Failed to process item:`,
            error instanceof Error ? error.message : String(error)
          )
          throw error
        })
      )
    )
    results.push(...batchResults)
  }
  return results
}

async function deleteAllEntries(
  environment: EnvironmentLike,
  contentTypeId: string
): Promise<number> {
  let deleted = 0
  let skip = 0
  const limit = 100
  const BATCH_SIZE = 20 // Process 20 entries in parallel

  while (true) {
    const response = await environment.getEntries({
      content_type: contentTypeId,
      limit,
      skip,
    })

    if (response.items.length === 0) {
      break
    }

    // Separate published and unpublished entries
    const publishedEntries = response.items.filter(
      (entry) => entry.sys.publishedAt
    )
    const unpublishedEntries = response.items.filter(
      (entry) => !entry.sys.publishedAt
    )

    // Batch unpublish published entries
    if (publishedEntries.length > 0) {
      await processInBatches(
        publishedEntries,
        async (entry) => {
          await entry.unpublish()
          return entry
        },
        BATCH_SIZE,
        `Unpublishing entries from ${contentTypeId}`
      )
    }

    // Batch delete all entries (now all unpublished)
    const allEntries = [...publishedEntries, ...unpublishedEntries]
    await processInBatches(
      allEntries,
      async (entry) => {
        await entry.delete()
        deleted++
        if (deleted % 50 === 0) {
          console.log(`  Deleted ${deleted} entries from ${contentTypeId}...`)
        }
        return entry
      },
      BATCH_SIZE,
      `Deleting entries from ${contentTypeId}`
    )

    skip += limit
    if (response.items.length < limit) {
      break
    }
  }

  return deleted
}

async function deleteAllContentTypes(
  environment: EnvironmentLike
): Promise<number> {
  const contentTypesResponse = await environment.getContentTypes()
  const contentTypes = contentTypesResponse.items
  const BATCH_SIZE = 10 // Process 10 content types in parallel

  console.log(`\nDeleting ${contentTypes.length} content types...`)

  // Separate published and unpublished content types
  const publishedContentTypes = contentTypes.filter((ct) => ct.sys.publishedAt)
  const unpublishedContentTypes = contentTypes.filter(
    (ct) => !ct.sys.publishedAt
  )

  // Batch unpublish published content types
  if (publishedContentTypes.length > 0) {
    await processInBatches(
      publishedContentTypes,
      async (contentType) => {
        await contentType.unpublish()
        console.log(`  Unpublished content type: ${contentType.sys.id}`)
        return contentType
      },
      BATCH_SIZE,
      'Unpublishing content types'
    )
  }

  // Batch delete all content types (now all unpublished)
  const allContentTypes = [...publishedContentTypes, ...unpublishedContentTypes]
  const deletedResults = await processInBatches(
    allContentTypes,
    async (contentType) => {
      await contentType.delete()
      console.log(`  Deleted content type: ${contentType.sys.id}`)
      return contentType
    },
    BATCH_SIZE,
    'Deleting content types'
  )

  return deletedResults.length
}

async function main() {
  console.log(`Starting Contentful cleanup [environment: ${ENVIRONMENT_ID}]...`)
  console.log('This will delete ALL entries and ALL content types.')
  console.log('This completely clears the Contentful space.\n')

  const environment = await getEnvironment()

  // Get all content types
  const contentTypesResponse = await environment.getContentTypes()
  const contentTypes = contentTypesResponse.items

  console.log(`Found ${contentTypes.length} content types.\n`)

  let totalDeletedEntries = 0

  // Delete entries from each content type
  console.log('Step 1: Deleting all entries...\n')
  for (const contentType of contentTypes) {
    const contentTypeId = contentType.sys.id
    console.log(`Processing content type: ${contentTypeId}`)

    try {
      const deleted = await deleteAllEntries(environment, contentTypeId)
      totalDeletedEntries += deleted
      console.log(`  Deleted ${deleted} entries from ${contentTypeId}\n`)
    } catch (error) {
      console.error(
        `  Failed to process content type ${contentTypeId}:`,
        error instanceof Error ? error.message : String(error)
      )
    }
  }

  // Delete all content types
  console.log('\nStep 2: Deleting all content types...\n')
  const totalDeletedContentTypes = await deleteAllContentTypes(environment)

  console.log(`\nCleanup complete!`)
  console.log(`Total entries deleted: ${totalDeletedEntries}`)
  console.log(`Total content types deleted: ${totalDeletedContentTypes}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
