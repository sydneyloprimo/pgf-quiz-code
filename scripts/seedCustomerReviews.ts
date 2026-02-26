/**
 * Creates CustomerReview content type, ReviewsEnabled feature flag, and seeds
 * customer reviews with hardcoded data from the codebase.
 *
 * Requires: CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN in env.
 * Run: yarn contentful:seed-reviews
 *
 * Optionally run yarn contentful:sync-images first to ensure review images
 * exist. If they don't, this script will create them from public/images/home/.
 */

import { existsSync as fsExistsSync, readFileSync } from 'fs'
import { join, resolve } from 'path'

import contentfulManagement from 'contentful-management'
import { config } from 'dotenv'

import { getSyncEnvironmentId } from '@/scripts/contentful/getEnvironment'

config({ path: '.env.local' })

const CONTENTFUL_LOCALE = 'en-US'
const CUSTOMER_REVIEW_CONTENT_TYPE_ID = 'customerReview'
const FEATURE_FLAG_CONTENT_TYPE_ID = 'featureFlag'
const PAGE_HOME_TAG_ID = 'pageHome'
const PAGE_HOME_TAG_NAME = 'page:Home'

const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
}

function pathToAssetId(relativePath: string): string {
  const withoutExt = relativePath.replace(/\.[^.]+$/, '')
  return (
    withoutExt
      .replace(/[/\\]/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '')
      .toLowerCase() || 'asset'
  )
}

function pathToCanonicalTitle(relativePath: string): string {
  return '/' + relativePath.replace(/\\/g, '/')
}

const SEED_REVIEWS = [
  {
    profilePicturePath: 'images/home/reviews-david.jpg',
    heading: 'More energy and joy at mealtime.',
    content:
      "My older dog was starting to get picky with his food and had lost some of his energy. Since switching to Purely Golden Foods, he's like a puppy again! He gobbles up his meals and has so much more pep in his step. Thank you for giving my furry friend a healthier and happier life!",
    clientName: 'David M.',
  },
  {
    profilePicturePath: 'images/home/reviews-mark.jpg',
    heading: 'Healthy, human-grade meals my puppy loves.',
    content:
      "I'm a new puppy parent and was worried about finding a food that was both healthy and appealing to my little guy. He absolutely loves the Purely Golden Foods meals! I love that it's human-grade and made with real ingredients I recognize. Plus, knowing it's good for him gives me such peace of mind.",
    clientName: 'Mark L.',
  },
  {
    profilePicturePath: 'images/home/reviews-david.jpg',
    heading: "Best decision for my dog's health.",
    content:
      'After years of trying different brands, I finally found what works for my sensitive golden. No more digestive issues, and his coat has never looked better! The quality is unmatched, and I can tell he feels great. Worth every penny for the peace of mind and visible results.',
    clientName: 'Sarah T.',
  },
] as const

type Environment = {
  getContentTypes(): Promise<{
    items: Array<{ sys: { id: string } }>
  }>
  createContentTypeWithId(
    id: string,
    data: Record<string, unknown>
  ): Promise<{ publish(): Promise<unknown> }>
  getEntries(query: Record<string, unknown>): Promise<{
    items: Array<{
      sys: { id: string }
      fields: Record<string, unknown>
      publish(): Promise<unknown>
    }>
  }>
  getEntry(id: string): Promise<{
    fields: Record<string, Record<string, unknown>>
    update(): Promise<{ publish(): Promise<unknown> }>
  }>
  createEntryWithId(
    contentTypeId: string,
    id: string,
    data: { fields: Record<string, Record<string, unknown>> }
  ): Promise<{ sys: { id: string }; publish(): Promise<unknown> }>
  getTags(): Promise<{ items: Array<{ sys: { id: string } }> }>
  createTag(
    id: string,
    name: string,
    visibility?: string
  ): Promise<{ sys: { id: string } }>
  getAsset(id: string): Promise<{ sys: { id: string } }>
  createUpload(data: { file: ArrayBuffer }): Promise<{ sys: { id: string } }>
  createAssetWithId(
    id: string,
    data: {
      fields: Record<string, unknown>
      metadata?: {
        tags: Array<{ sys: { type: string; linkType: string; id: string } }>
      }
    }
  ): Promise<{
    processForAllLocales(): Promise<{ publish(): Promise<unknown> }>
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
  const envId = getSyncEnvironmentId()
  return space.getEnvironment(envId) as Promise<Environment>
}

async function ensureTag(
  environment: Environment,
  id: string,
  name: string
): Promise<void> {
  const existing = await environment.getTags()
  if (existing.items.some((t) => t.sys.id === id)) return
  await environment.createTag(id, name, 'public')
  console.log(`Created tag: ${name} (${id})`)
}

async function ensureAsset(
  environment: Environment,
  relativePath: string,
  publicDir: string
): Promise<string> {
  const assetId = pathToAssetId(relativePath)
  const absolutePath = join(publicDir, relativePath)

  try {
    const asset = await environment.getAsset(assetId)
    return asset.sys.id
  } catch {
    // Asset does not exist, create it
  }

  if (!fsExistsSync(absolutePath)) {
    throw new Error(`Image not found: ${absolutePath}`)
  }

  const buffer = readFileSync(absolutePath)
  const ext = relativePath.split('.').pop()?.toLowerCase() ?? 'jpg'
  const contentType = MIME_TYPES[ext] ?? 'image/jpeg'
  const fileName = relativePath.split(/[/\\]/).pop() ?? 'image'

  const upload = await environment.createUpload({
    file: buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    ) as ArrayBuffer,
  })

  const tagLink = {
    sys: {
      type: 'Link' as const,
      linkType: 'Tag' as const,
      id: PAGE_HOME_TAG_ID,
    },
  }

  const asset = await environment.createAssetWithId(assetId, {
    fields: {
      title: { [CONTENTFUL_LOCALE]: pathToCanonicalTitle(relativePath) },
      file: {
        [CONTENTFUL_LOCALE]: {
          contentType,
          fileName,
          uploadFrom: {
            sys: {
              type: 'Link',
              linkType: 'Upload',
              id: upload.sys.id,
            },
          },
        },
      },
    },
    metadata: { tags: [tagLink] },
  })

  await asset.processForAllLocales()
  const refreshed = await environment.getAsset(assetId)
  const withPublish = refreshed as unknown as {
    publish: () => Promise<unknown>
  }
  await withPublish.publish()
  console.log(`Created asset: ${relativePath} (${assetId})`)
  return assetId
}

async function ensureCustomerReviewContentType(
  environment: Environment
): Promise<void> {
  const existing = await environment.getContentTypes()
  if (
    existing.items.some((ct) => ct.sys.id === CUSTOMER_REVIEW_CONTENT_TYPE_ID)
  )
    return

  const ct = await environment.createContentTypeWithId(
    CUSTOMER_REVIEW_CONTENT_TYPE_ID,
    {
      name: 'Customer Review',
      displayField: 'heading',
      fields: [
        {
          id: 'profilePicture',
          name: 'Profile Picture',
          type: 'Link',
          linkType: 'Asset',
          required: true,
        },
        {
          id: 'heading',
          name: 'Heading',
          type: 'Symbol',
          required: true,
        },
        {
          id: 'content',
          name: 'Content',
          type: 'Text',
          required: true,
        },
        {
          id: 'clientName',
          name: 'Client Name',
          type: 'Symbol',
          required: true,
        },
      ],
    }
  )
  await ct.publish()
  console.log(`Created content type: ${CUSTOMER_REVIEW_CONTENT_TYPE_ID}`)
}

async function ensureFeatureFlagEntry(
  environment: Environment,
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

async function ensureCustomerReviewEntry(
  environment: Environment,
  index: number,
  assetId: string,
  heading: string,
  content: string,
  clientName: string
): Promise<void> {
  const entryId = `customer-review-${index + 1}`

  const existing = await environment.getEntries({
    content_type: CUSTOMER_REVIEW_CONTENT_TYPE_ID,
    'sys.id': entryId,
    limit: 1,
  })

  const profilePictureLink = {
    sys: { type: 'Link' as const, linkType: 'Asset' as const, id: assetId },
  }

  const fields: Record<string, Record<string, unknown>> = {
    profilePicture: { [CONTENTFUL_LOCALE]: profilePictureLink },
    heading: { [CONTENTFUL_LOCALE]: heading },
    content: { [CONTENTFUL_LOCALE]: content },
    clientName: { [CONTENTFUL_LOCALE]: clientName },
  }

  if (existing.items.length > 0) {
    const entry = await environment.getEntry(entryId)
    entry.fields.profilePicture = { [CONTENTFUL_LOCALE]: profilePictureLink }
    entry.fields.heading = { [CONTENTFUL_LOCALE]: heading }
    entry.fields.content = { [CONTENTFUL_LOCALE]: content }
    entry.fields.clientName = { [CONTENTFUL_LOCALE]: clientName }
    const updated = await entry.update()
    await updated.publish()
    console.log(`Updated customer review: ${clientName}`)
    return
  }

  const entry = await environment.createEntryWithId(
    CUSTOMER_REVIEW_CONTENT_TYPE_ID,
    entryId,
    { fields }
  )
  await entry.publish()
  console.log(`Created customer review: ${clientName}`)
}

async function main(): Promise<void> {
  const envId = getSyncEnvironmentId()
  console.log(`Starting CustomerReview seed [environment: ${envId}]...\n`)

  const publicDir = resolve(process.cwd(), 'public')
  const environment = await getEnvironment()

  console.log('Ensuring page:Home tag exists...')
  await ensureTag(environment, PAGE_HOME_TAG_ID, PAGE_HOME_TAG_NAME)

  console.log('\nEnsuring assets exist...')
  const assetIds = new Map<string, string>()
  for (const path of [
    'images/home/reviews-david.jpg',
    'images/home/reviews-mark.jpg',
  ]) {
    const id = await ensureAsset(environment, path, publicDir)
    assetIds.set(path, id)
  }

  console.log('\nCreating CustomerReview content type...')
  await ensureCustomerReviewContentType(environment)

  console.log('\nCreating ReviewsEnabled feature flag...')
  await ensureFeatureFlagEntry(environment, 'ReviewsEnabled', false)

  console.log('\nCreating customer review entries...')
  for (let i = 0; i < SEED_REVIEWS.length; i++) {
    const r = SEED_REVIEWS[i]
    const assetId = assetIds.get(r.profilePicturePath)
    if (!assetId) {
      throw new Error(`Asset not found for ${r.profilePicturePath}`)
    }
    await ensureCustomerReviewEntry(
      environment,
      i,
      assetId,
      r.heading,
      r.content,
      r.clientName
    )
  }

  console.log('\nSeed complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
