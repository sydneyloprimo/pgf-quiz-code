/**
 * Syncs all images from public/images and public/icons to Contentful.
 * Groups assets by page using Tags (page:Home, page:About, …, Icons).
 * Sets asset title to canonical public path for app lookup.
 * Sets asset description from en.json image alt text when mapped.
 *
 * Requires: CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN in env.
 * Run: yarn contentful:sync-images
 */

import { createHash } from 'crypto'
import {
  existsSync as fsExistsSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'fs'
import { join, relative, resolve } from 'path'

import contentfulManagement from 'contentful-management'
import { config } from 'dotenv'

import { IMAGE_ALT_MAPPING } from '@/contentful/imageAltMapping'
import { getSyncEnvironmentId } from '@/scripts/contentful/getEnvironment'

config({ path: '.env.local' })

const CONTENTFUL_LOCALE = 'en-US'
const ENVIRONMENT_ID = getSyncEnvironmentId()
const FORCE_SYNC = process.argv.includes('--force')
const CONCURRENT_BATCH_SIZE = 4
const MAX_RETRIES = 4
const INITIAL_RETRY_DELAY_MS = 2000
const BATCH_DELAY_MS = 1500

/** Transient errors that warrant a retry. */
const RETRYABLE_ERROR_CODES = new Set([
  'EPIPE',
  'ECONNRESET',
  'ETIMEDOUT',
  'ECONNREFUSED',
  'ENOTFOUND',
  'EAI_AGAIN',
])

/** Snapshot file for incremental sync (namespaced by environment). */
const SNAPSHOT_PATH = resolve(
  process.cwd(),
  `scripts/.images-sync-snapshot.${ENVIRONMENT_ID}.json`
)

type ImagesSnapshot = Record<string, string>

function loadSnapshot(): ImagesSnapshot {
  try {
    if (fsExistsSync(SNAPSHOT_PATH)) {
      return JSON.parse(
        readFileSync(SNAPSHOT_PATH, 'utf-8')
      ) as ImagesSnapshot
    }
  } catch {
    // Corrupted snapshot, start fresh
  }
  return {}
}

function saveSnapshot(snapshot: ImagesSnapshot): void {
  writeFileSync(
    SNAPSHOT_PATH,
    JSON.stringify(snapshot, null, 2)
  )
}

/**
 * Computes a hash of the image file content and its
 * description to detect changes.
 */
function computeImageHash(
  filePath: string,
  description?: string
): string {
  const fileBuffer = readFileSync(filePath)
  const hash = createHash('md5')
  hash.update(fileBuffer)
  if (description) hash.update(description)
  return hash.digest('hex')
}

const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'])

const MIME_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  svg: 'image/svg+xml',
  webp: 'image/webp',
  gif: 'image/gif',
}

const TAGS: Array<{ id: string; name: string }> = [
  { id: 'pageHome', name: 'page:Home' },
  { id: 'pageAbout', name: 'page:About' },
  { id: 'pageFormulation', name: 'page:Formulation' },
  { id: 'pageQuiz', name: 'page:Quiz' },
  { id: 'pageAuth', name: 'page:Auth' },
  { id: 'pageCommon', name: 'page:Common' },
  { id: 'icons', name: 'Icons' },
]

function pathToTag(relativePath: string): string {
  const norm = relativePath.replace(/\\/g, '/')
  if (norm.startsWith('images/home/')) return 'pageHome'
  if (norm.startsWith('images/about/')) return 'pageAbout'
  if (norm.startsWith('images/formulation/')) return 'pageFormulation'
  if (norm.startsWith('images/quiz-loading/') || norm.startsWith('images/quiz'))
    return 'pageQuiz'
  if (
    norm.startsWith('images/login-') ||
    norm.startsWith('images/auth-background')
  )
    return 'pageAuth'
  if (norm.startsWith('icons/')) return 'icons'
  return 'pageCommon'
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

/** Resolves nested value from obj using dot-notation key (e.g. Home.Benefits.imageAlt). */
function getNestedValue(
  obj: Record<string, unknown>,
  keyPath: string
): string | undefined {
  const parts = keyPath.split('.')
  let current: unknown = obj
  for (const p of parts) {
    if (current && typeof current === 'object' && p in current) {
      current = (current as Record<string, unknown>)[p]
    } else {
      return undefined
    }
  }
  return typeof current === 'string' ? current : undefined
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms))
}

function isRetryableError(err: unknown): boolean {
  if (err instanceof Error) {
    const code = (err as Error & { code?: string }).code
    if (code && RETRYABLE_ERROR_CODES.has(code)) return true
    const msg = err.message.toLowerCase()
    if (
      msg.includes('rate limit') ||
      msg.includes('429') ||
      msg.includes('epipe') ||
      msg.includes('socket hang up') ||
      msg.includes('network')
    )
      return true
  }
  return false
}

async function withRetry<T>(fn: () => Promise<T>, context: string): Promise<T> {
  let lastErr: unknown
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (attempt < MAX_RETRIES && isRetryableError(err)) {
        const delay =
          INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt) + Math.random() * 500
        console.warn(
          `[warning] ${context}: ${err instanceof Error ? err.message : err}. ` +
            `Retrying in ${Math.round(delay).toString()}ms (attempt ${attempt + 2}/${MAX_RETRIES + 1})...`
        )
        await sleep(delay)
      } else {
        throw err
      }
    }
  }
  throw lastErr
}

function walkDir(
  dir: string,
  baseDir: string,
  out: Array<{ absolute: string; relative: string }>
): void {
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const abs = join(dir, e.name)
    const rel = relative(baseDir, abs)
    if (e.isDirectory()) {
      walkDir(abs, baseDir, out)
    } else if (e.isFile()) {
      const ext = e.name.split('.').pop()?.toLowerCase()
      if (ext && IMAGE_EXTENSIONS.has(ext)) {
        out.push({ absolute: abs, relative: rel })
      }
    }
  }
}

interface FileItem {
  absolute: string
  relative: string
  assetId: string
  tagId: string
  title: string
  contentType: string
  description?: string
}

type Environment = {
  getTags(): Promise<{ items: Array<{ sys: { id: string } }> }>
  createTag(
    id: string,
    name: string,
    visibility?: string
  ): Promise<{ sys: { id: string } }>
  getAsset(id: string): Promise<unknown>
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
  return space.getEnvironment(ENVIRONMENT_ID) as Promise<
    ReturnType<typeof getEnvironment> extends Promise<infer T> ? T : never
  >
}

async function ensureTags(environment: Environment): Promise<void> {
  const existing = await environment.getTags()
  const existingIds = new Set(existing.items.map((t) => t.sys.id))
  for (const tag of TAGS) {
    if (!existingIds.has(tag.id)) {
      await environment.createTag(tag.id, tag.name, 'public')
      console.log(`Created tag: ${tag.name} (${tag.id})`)
    }
  }
}

async function uploadOne(
  environment: Environment,
  item: FileItem
): Promise<boolean> {
  const fields: Record<string, unknown> = {
    title: { [CONTENTFUL_LOCALE]: item.title },
  }
  if (item.description) {
    fields.description = { [CONTENTFUL_LOCALE]: item.description }
  }

  try {
    const existing = await environment.getAsset(item.assetId)
    if (item.description) {
      const existingAsset = existing as {
        fields: { description?: Record<string, string> }
        update: () => Promise<{ publish: () => Promise<unknown> }>
      }
      const currentDesc = existingAsset.fields?.description?.[CONTENTFUL_LOCALE]
      if (currentDesc !== item.description) {
        existingAsset.fields.description = {
          [CONTENTFUL_LOCALE]: item.description,
        }
        const updated = await existingAsset.update()
        await updated.publish()
        console.log(`  Updated description: ${item.relative}`)
      }
    }
    return false
  } catch {
    // Asset does not exist, proceed to create
  }

  const buffer = readFileSync(item.absolute)
  const ext = item.relative.split('.').pop()?.toLowerCase() ?? 'png'
  const contentType = MIME_TYPES[ext] ?? 'image/png'
  const fileName = item.relative.split(/[/\\]/).pop() ?? 'image'

  const upload = await environment.createUpload({
    file: buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    ) as ArrayBuffer,
  })

  const tagLink = {
    sys: { type: 'Link' as const, linkType: 'Tag' as const, id: item.tagId },
  }

  const asset = await environment.createAssetWithId(item.assetId, {
    fields: {
      ...fields,
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
  const refreshed = (await environment.getAsset(item.assetId)) as {
    publish: () => Promise<unknown>
  }
  await refreshed.publish()
  return true
}

async function processInBatches<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number,
  getContext: (item: T, index: number) => string
): Promise<R[]> {
  const results: R[] = []
  for (let i = 0; i < items.length; i += batchSize) {
    if (i > 0) {
      await sleep(BATCH_DELAY_MS)
    }
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map((item, batchIdx) => {
        const idx = i + batchIdx
        return withRetry(
          () =>
            processor(item).catch((err) => {
              console.error(err instanceof Error ? err.message : String(err))
              throw err
            }),
          getContext(item, idx)
        )
      })
    )
    results.push(...batchResults)
    const done = Math.min(i + batchSize, items.length)
    if (done % 20 === 0 || done === items.length) {
      console.log(`  Processed ${done}/${items.length}`)
    }
  }
  return results
}

async function main(): Promise<void> {
  const mode = FORCE_SYNC ? 'full' : 'incremental'
  console.log(
    `Starting Contentful images sync (${mode}) ` +
      `[environment: ${ENVIRONMENT_ID}]...\n`
  )

  const enJsonPath = resolve(process.cwd(), 'messages/en.json')
  const enJson = JSON.parse(readFileSync(enJsonPath, 'utf-8')) as Record<
    string,
    unknown
  >

  const publicDir = join(process.cwd(), 'public')
  const imagesDir = join(publicDir, 'images')
  const iconsDir = join(publicDir, 'icons')

  const files: Array<{ absolute: string; relative: string }> = []
  if (fsExistsSync(imagesDir)) walkDir(imagesDir, publicDir, files)
  if (fsExistsSync(iconsDir)) walkDir(iconsDir, publicDir, files)

  const allItems: FileItem[] = files.map((f) => {
    const ext = f.relative.split('.').pop()?.toLowerCase() ?? 'png'
    const title = pathToCanonicalTitle(f.relative)
    const altKey = IMAGE_ALT_MAPPING[title]
    const description = altKey ? getNestedValue(enJson, altKey) : undefined
    return {
      ...f,
      assetId: pathToAssetId(f.relative),
      tagId: pathToTag(f.relative),
      title,
      contentType: MIME_TYPES[ext] ?? 'image/png',
      description,
    }
  })

  /** Dedupe by assetId - pathToAssetId strips extension, so .svg and .png share IDs. */
  const seenIds = new Set<string>()
  const dedupedItems = allItems.filter((item) => {
    if (seenIds.has(item.assetId)) return false
    seenIds.add(item.assetId)
    return true
  })

  const previousSnapshot = loadSnapshot()
  const currentSnapshot: ImagesSnapshot = {}

  /** Compute hashes and filter to only changed items. */
  const items: FileItem[] = []
  let skippedCount = 0
  for (const item of dedupedItems) {
    const hash = computeImageHash(
      item.absolute,
      item.description
    )
    currentSnapshot[item.relative] = hash

    if (
      !FORCE_SYNC &&
      previousSnapshot[item.relative] === hash
    ) {
      skippedCount++
      continue
    }
    items.push(item)
  }

  const withDescription = items.filter((i) => i.description).length
  const firstWithDesc = items.find((i) => i.description)
  console.log(
    `Discovered ${dedupedItems.length} image assets ` +
      `(${allItems.length} files). ` +
      `${items.length} changed, ${skippedCount} unchanged.`
  )
  if (items.length > 0 && withDescription > 0 && firstWithDesc) {
    console.log(
      `  Example: ${firstWithDesc.relative} -> ` +
        `"${firstWithDesc.description?.slice(0, 50)}..."`
    )
  }
  console.log('')

  if (items.length === 0) {
    console.log('No changes detected. Nothing to sync.')
    saveSnapshot(currentSnapshot)
    console.log('\nSync complete.')
    return
  }

  const environment = await getEnvironment()

  console.log('Ensuring tags exist...')
  await ensureTags(environment)

  console.log(
    '\nUploading assets (batch size %d)...',
    CONCURRENT_BATCH_SIZE
  )
  let uploaded = 0
  const results = await processInBatches(
    items,
    (item) => uploadOne(environment, item),
    CONCURRENT_BATCH_SIZE,
    (item, idx) =>
      `asset ${idx + 1}/${items.length} (${item.relative})`
  )
  uploaded = results.filter(Boolean).length
  console.log(
    `  Uploaded ${uploaded} new assets ` +
      `(${items.length - uploaded} already existed).`
  )

  saveSnapshot(currentSnapshot)
  console.log('\nSync complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
