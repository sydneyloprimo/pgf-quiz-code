/**
 * Seeds TableRichText entries in Contentful for recipe tables.
 * Uses the existing Turkey data from constants + en.json translations.
 *
 * Requires: CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN in env.
 * Run: yarn contentful:seed-tables
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

import contentfulManagement from 'contentful-management'
import { config } from 'dotenv'

import {
  CONTENTFUL_CONTENT_TYPES,
  CONTENTFUL_FIELDS,
  CONTENTFUL_LOCALE,
  RECIPE_TABLE_KEYS,
} from '@/contentful/config'
import { getSyncEnvironmentId } from '@/scripts/contentful/getEnvironment'

config({ path: '.env.local' })

const ENVIRONMENT_ID = getSyncEnvironmentId()

interface TextNode {
  nodeType: 'text'
  value: string
  marks: never[]
  data: Record<string, never>
}

interface ParagraphNode {
  nodeType: 'paragraph'
  data: Record<string, never>
  content: TextNode[]
}

interface TableCellNode {
  nodeType: 'table-cell' | 'table-header-cell'
  data: Record<string, never>
  content: ParagraphNode[]
}

interface TableRowNode {
  nodeType: 'table-row'
  data: Record<string, never>
  content: TableCellNode[]
}

interface TableNode {
  nodeType: 'table'
  data: Record<string, never>
  content: TableRowNode[]
}

interface RichTextDocument {
  nodeType: 'document'
  data: Record<string, never>
  content: TableNode[]
}

function text(value: string): TextNode {
  return {
    nodeType: 'text',
    value,
    marks: [] as never[],
    data: {} as Record<string, never>,
  }
}

function paragraph(value: string): ParagraphNode {
  return {
    nodeType: 'paragraph',
    data: {} as Record<string, never>,
    content: [text(value)],
  }
}

function headerCell(value: string): TableCellNode {
  return {
    nodeType: 'table-header-cell',
    data: {} as Record<string, never>,
    content: [paragraph(value)],
  }
}

function dataCell(value: string): TableCellNode {
  return {
    nodeType: 'table-cell',
    data: {} as Record<string, never>,
    content: [paragraph(value)],
  }
}

function tableRow(cells: TableCellNode[]): TableRowNode {
  return {
    nodeType: 'table-row',
    data: {} as Record<string, never>,
    content: cells,
  }
}

function buildRichTextTable(
  headers: string[],
  rows: string[][]
): RichTextDocument {
  const headerRow = tableRow(headers.map((h) => headerCell(h)))
  const dataRows = rows.map((row) =>
    tableRow(row.map((cell) => dataCell(cell)))
  )
  return {
    nodeType: 'document',
    data: {} as Record<string, never>,
    content: [
      {
        nodeType: 'table',
        data: {} as Record<string, never>,
        content: [headerRow, ...dataRows],
      },
    ],
  }
}

const messages = JSON.parse(
  readFileSync(resolve(process.cwd(), 'messages/en.json'), 'utf-8')
) as Record<string, unknown>

function getTranslation(path: string): string {
  const parts = path.split('.')
  let current: unknown = messages
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part]
    } else {
      return path
    }
  }
  return typeof current === 'string' ? current : path
}

const GUARANTEED_ANALYSIS_DATA = [
  {
    nutrientKey: 'crudeProtein',
    value: '19.4%',
  },
  { nutrientKey: 'crudeFat', value: '9.5%' },
  { nutrientKey: 'crudeFiber', value: '1.1%' },
  { nutrientKey: 'moisture', value: '66.2%' },
  { nutrientKey: 'ash', value: '1.3%' },
]

const MINERALS_DATA = [
  {
    nameKey: 'calcium',
    unit: 'g',
    recipe: '1.79',
    dm: '0.92%',
  },
  {
    nameKey: 'phosphorous',
    unit: 'g',
    recipe: '1.29',
    dm: '0.66%',
  },
  {
    nameKey: 'potassium',
    unit: 'g',
    recipe: '1.79',
    dm: '0.92%',
  },
  {
    nameKey: 'sodium',
    unit: 'g',
    recipe: '0.45',
    dm: '0.23%',
  },
  {
    nameKey: 'magnesium',
    unit: 'g',
    recipe: '0.35',
    dm: '0.18%',
  },
  {
    nameKey: 'iron',
    unit: 'mg',
    recipe: '14.74',
    dm: '75.33',
  },
  {
    nameKey: 'copper',
    unit: 'mg',
    recipe: '2.52',
    dm: '12.89',
  },
  {
    nameKey: 'manganese',
    unit: 'mg',
    recipe: '2.01',
    dm: '10.28',
  },
  {
    nameKey: 'zinc',
    unit: 'mg',
    recipe: '33.98',
    dm: '173.67',
  },
  {
    nameKey: 'iodine',
    unit: 'mg',
    recipe: '0.90',
    dm: '4.61',
  },
  {
    nameKey: 'selenium',
    unit: 'mg',
    recipe: '0.15',
    dm: '0.79',
  },
]

const VITAMINS_DATA = [
  {
    nameKey: 'vitaminA',
    unit: 'IU',
    recipe: '18,425.35',
    dm: '94,161.11',
  },
  {
    nameKey: 'vitaminC',
    unit: 'mg',
    recipe: '17.30',
    dm: '88.41',
  },
  {
    nameKey: 'vitaminD',
    unit: 'IU',
    recipe: '330.40',
    dm: '1,688.49',
  },
  {
    nameKey: 'vitaminE',
    unit: 'IU',
    recipe: '55.48',
    dm: '283.51',
  },
  {
    nameKey: 'thiamineB1',
    unit: 'mg',
    recipe: '4.32',
    dm: '22.09',
  },
  {
    nameKey: 'riboflavinB2',
    unit: 'mg',
    recipe: '2.46',
    dm: '12.57',
  },
  {
    nameKey: 'niacinB3',
    unit: 'mg',
    recipe: '32.88',
    dm: '168.05',
  },
  {
    nameKey: 'pantothenicAcidB5',
    unit: 'mg',
    recipe: '9.22',
    dm: '47.11',
  },
  {
    nameKey: 'b6Pyridoxine',
    unit: 'mg',
    recipe: '2.23',
    dm: '11.41',
  },
  {
    nameKey: 'vitaminB12',
    unit: 'mg',
    recipe: '0.02',
    dm: '0.10',
  },
  {
    nameKey: 'folicAcid',
    unit: 'mg',
    recipe: '0.37',
    dm: '1.89',
  },
  {
    nameKey: 'choline',
    unit: 'mg',
    recipe: '649.39',
    dm: '3,318.67',
  },
  {
    nameKey: 'vitaminK1',
    unit: 'mg',
    recipe: '0.41',
    dm: '2.08',
  },
  {
    nameKey: 'biotin',
    unit: 'mg',
    recipe: '0.01',
    dm: '0.07',
  },
]

const FATS_DATA = [
  {
    nameKey: 'total',
    unit: 'g',
    recipe: '54.67',
    dm: '27.94%',
  },
  {
    nameKey: 'saturated',
    unit: 'g',
    recipe: '13.64',
    dm: '6.97%',
  },
  {
    nameKey: 'monounsaturated',
    unit: 'g',
    recipe: '17.26',
    dm: '8.82%',
  },
  {
    nameKey: 'polyunsaturated',
    unit: 'g',
    recipe: '16.88',
    dm: '8.63%',
  },
  {
    nameKey: 'la',
    unit: 'g',
    recipe: '11.95',
    dm: '6.11%',
  },
  {
    nameKey: 'ala',
    unit: 'g',
    recipe: '3.46',
    dm: '1.77%',
  },
  {
    nameKey: 'aa',
    unit: 'g',
    recipe: '0.81',
    dm: '0.42%',
  },
  {
    nameKey: 'epa',
    unit: 'g',
    recipe: '0.17',
    dm: '0.09%',
  },
  {
    nameKey: 'dpa',
    unit: 'g',
    recipe: '0.05',
    dm: '0.02%',
  },
  {
    nameKey: 'dha',
    unit: 'g',
    recipe: '0.17',
    dm: '0.09%',
  },
  {
    nameKey: 'epaDha',
    unit: 'g',
    recipe: '0.34',
    dm: '0.00%',
  },
]

const AMINO_ACIDS_DATA = [
  {
    nameKey: 'totalProtein',
    unit: 'g',
    recipe: '112.35',
    dm: '57.42%',
  },
  {
    nameKey: 'tryptophan',
    unit: 'g',
    recipe: '1.28',
    dm: '0.65%',
  },
  {
    nameKey: 'threonine',
    unit: 'g',
    recipe: '5.10',
    dm: '2.60%',
  },
  {
    nameKey: 'isoleucine',
    unit: 'g',
    recipe: '5.15',
    dm: '2.63%',
  },
  {
    nameKey: 'leucine',
    unit: 'g',
    recipe: '9.33',
    dm: '4.77%',
  },
  {
    nameKey: 'lysine',
    unit: 'g',
    recipe: '9.56',
    dm: '4.88%',
  },
  {
    nameKey: 'methionine',
    unit: 'g',
    recipe: '3.22',
    dm: '1.65%',
  },
  {
    nameKey: 'methionineCystine',
    unit: 'g',
    recipe: '4.62',
    dm: '2.36%',
  },
  {
    nameKey: 'phenylalanine',
    unit: 'g',
    recipe: '4.68',
    dm: '2.39%',
  },
  {
    nameKey: 'phenylalanineTyrosine',
    unit: 'g',
    recipe: '8.73',
    dm: '4.46%',
  },
  {
    nameKey: 'valine',
    unit: 'g',
    recipe: '5.54',
    dm: '2.83%',
  },
  {
    nameKey: 'arginine',
    unit: 'g',
    recipe: '7.97',
    dm: '4.07%',
  },
  {
    nameKey: 'histidine',
    unit: 'g',
    recipe: '3.24',
    dm: '1.66%',
  },
  {
    nameKey: 'purines',
    unit: 'mg',
    recipe: '80.01',
    dm: '0.04%',
  },
  {
    nameKey: 'taurine',
    unit: 'g',
    recipe: '0.05',
    dm: '0.03%',
  },
]

function buildGuaranteedAnalysisDoc(): RichTextDocument {
  const nutrientLabel = getTranslation(
    'Recipes.GuaranteedAnalysis.nutrientLabel'
  )
  const percentLabel = getTranslation('Recipes.GuaranteedAnalysis.percentLabel')

  return buildRichTextTable(
    [nutrientLabel, percentLabel],
    GUARANTEED_ANALYSIS_DATA.map((row) => [
      getTranslation(`Recipes.GuaranteedAnalysis.${row.nutrientKey}`),
      row.value,
    ])
  )
}

function build4ColDoc(
  column1Label: string,
  data: Array<{
    nameKey: string
    unit: string
    recipe: string
    dm: string
  }>
): RichTextDocument {
  const unitLabel = getTranslation('Recipes.NutritionPanel.unitLabel')
  const recipeLabel = getTranslation('Recipes.NutritionPanel.recipeLabel')
  const dmLabel = getTranslation('Recipes.NutritionPanel.dmLabel')

  return buildRichTextTable(
    [column1Label, unitLabel, recipeLabel, dmLabel],
    data.map((row) => [
      getTranslation(`Recipes.NutritionPanel.nutrients.${row.nameKey}`),
      row.unit,
      row.recipe,
      row.dm,
    ])
  )
}

interface TableEntry {
  key: string
  doc: RichTextDocument
}

function buildTurkeyEntries(): TableEntry[] {
  const mineralLabel = getTranslation('Recipes.NutritionPanel.mineralLabel')
  const vitaminLabel = getTranslation('Recipes.NutritionPanel.vitaminLabel')
  const fatLabel = getTranslation('Recipes.NutritionPanel.fatLabel')
  const aminoAcidLabel = getTranslation('Recipes.NutritionPanel.aminoAcidLabel')

  return [
    {
      key: RECIPE_TABLE_KEYS.turkey.guaranteedAnalysis,
      doc: buildGuaranteedAnalysisDoc(),
    },
    {
      key: RECIPE_TABLE_KEYS.turkey.minerals,
      doc: build4ColDoc(mineralLabel, MINERALS_DATA),
    },
    {
      key: RECIPE_TABLE_KEYS.turkey.vitamins,
      doc: build4ColDoc(vitaminLabel, VITAMINS_DATA),
    },
    {
      key: RECIPE_TABLE_KEYS.turkey.fats,
      doc: build4ColDoc(fatLabel, FATS_DATA),
    },
    {
      key: RECIPE_TABLE_KEYS.turkey.aminoAcids,
      doc: build4ColDoc(aminoAcidLabel, AMINO_ACIDS_DATA),
    },
  ]
}

function buildPlaceholderEntries(recipe: 'lamb' | 'seafood'): TableEntry[] {
  const keys = RECIPE_TABLE_KEYS[recipe]
  const placeholderDoc = buildRichTextTable(['—', '—'], [['—', '—']])

  return Object.values(keys).map((key) => ({
    key,
    doc: placeholderDoc,
  }))
}

type Environment = {
  getEntries(query: Record<string, unknown>): Promise<{
    items: Array<{
      sys: { id: string }
      fields: Record<string, unknown>
    }>
  }>
  getEntry(id: string): Promise<{
    fields: Record<string, Record<string, unknown>>
    update(): Promise<{
      publish(): Promise<unknown>
    }>
  }>
  createEntryWithId(
    contentTypeId: string,
    id: string,
    data: {
      fields: Record<string, Record<string, unknown>>
    }
  ): Promise<{
    sys: { id: string }
    publish(): Promise<unknown>
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

async function upsertTableEntry(
  environment: Environment,
  entry: TableEntry
): Promise<void> {
  const entryId = entry.key.replace(/[^a-zA-Z0-9-]/g, '').substring(0, 64)

  const fields = {
    [CONTENTFUL_FIELDS.key]: {
      [CONTENTFUL_LOCALE]: entry.key,
    },
    [CONTENTFUL_FIELDS.table]: {
      [CONTENTFUL_LOCALE]: entry.doc,
    },
  }

  const existing = await environment.getEntries({
    content_type: CONTENTFUL_CONTENT_TYPES.tableRichText,
    [`fields.${CONTENTFUL_FIELDS.key}`]: entry.key,
    limit: 1,
  })

  if (existing.items.length > 0) {
    const existingEntry = await environment.getEntry(existing.items[0].sys.id)
    existingEntry.fields[CONTENTFUL_FIELDS.key] = {
      [CONTENTFUL_LOCALE]: entry.key,
    }
    existingEntry.fields[CONTENTFUL_FIELDS.table] = {
      [CONTENTFUL_LOCALE]: entry.doc,
    }
    const updated = await existingEntry.update()
    await updated.publish()
    console.log(`Updated: ${entry.key}`)
    return
  }

  const created = await environment.createEntryWithId(
    CONTENTFUL_CONTENT_TYPES.tableRichText,
    entryId,
    { fields }
  )
  await created.publish()
  console.log(`Created: ${entry.key}`)
}

async function main(): Promise<void> {
  const envId = getSyncEnvironmentId()
  console.log(`Seeding recipe tables [environment: ${envId}]...\n`)

  const environment = await getEnvironment()

  const entries = [
    ...buildTurkeyEntries(),
    ...buildPlaceholderEntries('lamb'),
    ...buildPlaceholderEntries('seafood'),
  ]

  for (const entry of entries) {
    await upsertTableEntry(environment, entry)
  }

  console.log(`\nSeeded ${entries.length} table entries.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
