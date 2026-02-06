/**
 * Syncs all images from public/images and public/icons to Contentful.
 * Groups assets by page using Tags (page:Home, page:About, …, Icons).
 * Sets asset title to canonical public path for app lookup.
 *
 * Requires: CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN in env.
 * Run: yarn contentful:sync-images
 */

import { existsSync as fsExistsSync, readFileSync, readdirSync } from 'fs'
import { join, relative } from 'path'

import contentfulManagement from 'contentful-management'
import { config } from 'dotenv'

config({ path: '.env.local' })

const CONTENTFUL_LOCALE = 'en-US'
const ENVIRONMENT_ID = 'master'
const CONCURRENT_BATCH_SIZE = 6

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
  try {
    await environment.getAsset(item.assetId)
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
      title: { [CONTENTFUL_LOCALE]: item.title },
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
  console.log('Starting Contentful images sync...\n')

  const publicDir = join(process.cwd(), 'public')
  const imagesDir = join(publicDir, 'images')
  const iconsDir = join(publicDir, 'icons')

  const files: Array<{ absolute: string; relative: string }> = []
  if (fsExistsSync(imagesDir)) walkDir(imagesDir, publicDir, files)
  if (fsExistsSync(iconsDir)) walkDir(iconsDir, publicDir, files)

  const items: FileItem[] = files.map((f) => {
    const ext = f.relative.split('.').pop()?.toLowerCase() ?? 'png'
    return {
      ...f,
      assetId: pathToAssetId(f.relative),
      tagId: pathToTag(f.relative),
      title: pathToCanonicalTitle(f.relative),
      contentType: MIME_TYPES[ext] ?? 'image/png',
    }
  })

  console.log(`Discovered ${items.length} image files.\n`)

  const environment = await getEnvironment()

  console.log('Ensuring tags exist...')
  await ensureTags(environment)

  console.log('\nUploading assets (batch size %d)...', CONCURRENT_BATCH_SIZE)
  let uploaded = 0
  const results = await processInBatches(
    items,
    (item) => uploadOne(environment, item),
    CONCURRENT_BATCH_SIZE
  )
  uploaded = results.filter(Boolean).length
  console.log(
    `  Uploaded ${uploaded} new assets (${items.length - uploaded} already existed).`
  )

  console.log('\nSync complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
