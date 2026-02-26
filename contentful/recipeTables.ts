import type { Document } from '@contentful/rich-text-types'
import type { EntrySkeletonType } from 'contentful'

import { contentfulClient } from '@/contentful/client'
import {
  CONTENTFUL_CONTENT_TYPES,
  CONTENTFUL_FIELDS,
  CONTENTFUL_LOCALE,
  RECIPE_TABLE_KEYS,
} from '@/contentful/config'

function isRichTextDocument(value: unknown): value is Document {
  return (
    typeof value === 'object' &&
    value !== null &&
    'nodeType' in value &&
    (value as { nodeType: string }).nodeType === 'document'
  )
}

interface TableRichTextFields {
  key: EntrySkeletonType['fields']
  table: EntrySkeletonType['fields']
}

interface TableRichTextSkeleton extends EntrySkeletonType {
  contentTypeId: typeof CONTENTFUL_CONTENT_TYPES.tableRichText
  fields: TableRichTextFields
}

interface RecipeTableData {
  guaranteedAnalysis: Document | null
  minerals: Document | null
  vitamins: Document | null
  fats: Document | null
  aminoAcids: Document | null
}

type RecipeTablesMap = Record<string, RecipeTableData>

const EMPTY_TABLE_DATA: RecipeTableData = {
  guaranteedAnalysis: null,
  minerals: null,
  vitamins: null,
  fats: null,
  aminoAcids: null,
}

/**
 * Fetches all TableRichText entries for recipes
 * and organises them by recipe + table type.
 */
export async function getRecipeTables(): Promise<RecipeTablesMap> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  if (!spaceId || !accessToken) {
    return {
      turkey: { ...EMPTY_TABLE_DATA },
      lamb: { ...EMPTY_TABLE_DATA },
      seafood: { ...EMPTY_TABLE_DATA },
    }
  }

  try {
    const response = await contentfulClient.getEntries<TableRichTextSkeleton>({
      content_type: CONTENTFUL_CONTENT_TYPES.tableRichText,
      locale: CONTENTFUL_LOCALE,
      limit: 100,
    })

    const entryMap = new Map<string, Document>()
    for (const item of response.items) {
      const key = item.fields[CONTENTFUL_FIELDS.key]
      const table = item.fields[CONTENTFUL_FIELDS.table]
      if (typeof key === 'string' && table && isRichTextDocument(table)) {
        entryMap.set(key, table)
      }
    }

    const result: RecipeTablesMap = {
      turkey: { ...EMPTY_TABLE_DATA },
      lamb: { ...EMPTY_TABLE_DATA },
      seafood: { ...EMPTY_TABLE_DATA },
    }

    for (const [recipe, keys] of Object.entries(RECIPE_TABLE_KEYS)) {
      const data = result[recipe as keyof typeof RECIPE_TABLE_KEYS]
      for (const [field, entryKey] of Object.entries(keys)) {
        const doc = entryMap.get(entryKey)
        if (doc) {
          data[field as keyof RecipeTableData] = doc
        }
      }
    }

    return result
  } catch {
    return {
      turkey: { ...EMPTY_TABLE_DATA },
      lamb: { ...EMPTY_TABLE_DATA },
      seafood: { ...EMPTY_TABLE_DATA },
    }
  }
}
