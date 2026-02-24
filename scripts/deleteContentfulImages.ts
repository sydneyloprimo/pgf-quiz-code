/**
 * Deletes only image assets from Contentful that were synced by syncImagesToContentful.
 * Option A: assets with our page/Icons tags. Option B: all assets with image/* mimetype.
 * Does not delete entries or non-image assets.
 *
 * Requires: CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN in env.
 * Run: yarn contentful:delete-images
 */

import contentfulManagement from 'contentful-management'
import { config } from 'dotenv'

import { getSyncEnvironmentId } from '@/scripts/contentful/getEnvironment'

config({ path: '.env.local' })

const ENVIRONMENT_ID = getSyncEnvironmentId()
const CONCURRENT_BATCH_SIZE = 6

const SYNC_TAG_IDS =
  'pageHome,pageAbout,pageFormulation,pageQuiz,pageAuth,pageCommon,icons'

type Environment = {
  getAssets(query?: {
    limit?: number
    skip?: number
    'metadata.tags.sys.id[in]'?: string
  }): Promise<{
    items: Array<{
      sys: { id: string; publishedAt?: string | null }
      unpublish(): Promise<unknown>
      delete(): Promise<void>
    }>
    total: number
  }>
}

async function getEnvironment(): Promise<Environment> {
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
  return space.getEnvironment(ENVIRONMENT_ID) as Promise<Environment>
}

async function fetchAllAssetsByTags(environment: Environment): Promise<
  Array<{
    sys: { id: string; publishedAt?: string | null }
    unpublish(): Promise<unknown>
    delete(): Promise<void>
  }>
> {
  const all: Array<{
    sys: { id: string; publishedAt?: string | null }
    unpublish(): Promise<unknown>
    delete(): Promise<void>
  }> = []
  let skip = 0
  const limit = 100
  while (true) {
    const res = await environment.getAssets({
      limit,
      skip,
      'metadata.tags.sys.id[in]': SYNC_TAG_IDS,
    })
    all.push(...res.items)
    if (res.items.length < limit) break
    skip += limit
  }
  return all
}

async function processInBatches<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number
): Promise<R[]> {
  const results: R[] = []
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map((item) =>
        processor(item).catch((err) => {
          console.error(err instanceof Error ? err.message : String(err))
          throw err
        })
      )
    )
    results.push(...batchResults)
  }
  return results
}

async function main(): Promise<void> {
  console.log(
    `Fetching image assets (by sync tags) [environment: ${ENVIRONMENT_ID}]...\n`
  )

  const environment = await getEnvironment()
  const assets = await fetchAllAssetsByTags(environment)

  console.log(`Found ${assets.length} assets to delete.\n`)
  if (assets.length === 0) {
    console.log('Nothing to delete.')
    return
  }

  console.log(
    `Unpublishing and deleting in batches of ${CONCURRENT_BATCH_SIZE}...`
  )
  let deleted = 0
  await processInBatches(
    assets,
    async (asset) => {
      if (asset.sys.publishedAt) {
        await asset.unpublish()
      }
      await asset.delete()
      deleted++
      if (deleted % 10 === 0 || deleted === assets.length) {
        console.log(`  Deleted ${deleted}/${assets.length}`)
      }
      return undefined
    },
    CONCURRENT_BATCH_SIZE
  )

  console.log(`\nDeleted ${deleted} image assets.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
