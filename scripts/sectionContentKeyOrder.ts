/**
 * Extracts content key order from components (JSX/HTML top-to-bottom).
 * Run: npx tsx scripts/sectionContentKeyOrder.ts
 * Outputs to scripts/sectionContentKeyOrder.json for use by syncEnJsonToContentful.
 */

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'

import { BENEFITS_DATA, FAQS_DATA, HOW_IT_WORKS_STEPS } from '@/constants'

const COMPONENTS_DIR = resolve(process.cwd(), 'components')

function walkDir(dir: string): string[] {
  let files: string[] = []
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name !== 'node_modules' && !e.name.startsWith('.')) {
        files = files.concat(walkDir(full))
      }
    } else if (e.name.endsWith('.tsx') || e.name.endsWith('.ts')) {
      files.push(full)
    }
  }
  return files
}

interface BenefitKeyItem {
  titleKey: string
  descriptionKey: string
  pointerLabelKey?: string
}

/** Constant arrays that provide key order for dynamic t(key) calls. */
const CONSTANT_KEY_SOURCES: Record<
  string,
  Array<Record<string, string> | BenefitKeyItem>
> = {
  BENEFITS_DATA: BENEFITS_DATA as Array<{
    titleKey: string
    descriptionKey: string
    pointerLabelKey?: string
  }>,
  FAQS_DATA: FAQS_DATA as Array<{ questionKey: string; answerKey: string }>,
  HOW_IT_WORKS_STEPS: HOW_IT_WORKS_STEPS as Array<{
    titleKey: string
    descriptionKey: string
  }>,
}

function getKeysFromConstant(constName: string, keyFields: string[]): string[] {
  const arr = CONSTANT_KEY_SOURCES[constName]
  if (!arr) return []
  const keys: string[] = []
  for (const item of arr) {
    for (const field of keyFields) {
      const val = (item as Record<string, string>)[field]
      if (val && !keys.includes(val)) keys.push(val)
    }
  }
  return keys
}

function extractKeyOrderFromFile(
  filePath: string,
  content: string
): Map<string, string[]> {
  const result = new Map<string, string[]>()

  const namespaceMatch = content.match(
    /useTranslations\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/
  )
  if (!namespaceMatch) return result

  const namespace = namespaceMatch[1]
  const keys: string[] = []
  const seen = new Set<string>()

  const literalKeyRe = /t\s*\(\s*['"`]([a-zA-Z0-9_.]+)['"`]\s*(?:,|\))/g
  let m
  while ((m = literalKeyRe.exec(content)) !== null) {
    const fullKey = m[1]
    const topLevelKey = fullKey.includes('.') ? fullKey.split('.')[0] : fullKey
    if (!seen.has(topLevelKey)) {
      seen.add(topLevelKey)
      keys.push(topLevelKey)
    }
  }

  if (content.includes('BENEFITS_DATA')) {
    const benefitKeys = getKeysFromConstant('BENEFITS_DATA', [
      'titleKey',
      'descriptionKey',
      'pointerLabelKey',
    ])
    for (const k of benefitKeys) {
      if (!seen.has(k)) {
        seen.add(k)
        keys.push(k)
      }
    }
  }
  if (content.includes('FAQS_DATA')) {
    const faqKeys = getKeysFromConstant('FAQS_DATA', [
      'questionKey',
      'answerKey',
    ])
    for (const k of faqKeys) {
      if (!seen.has(k)) {
        seen.add(k)
        keys.push(k)
      }
    }
  }
  if (content.includes('HOW_IT_WORKS_STEPS')) {
    const howKeys = getKeysFromConstant('HOW_IT_WORKS_STEPS', [
      'titleKey',
      'descriptionKey',
    ])
    for (const k of howKeys) {
      if (!seen.has(k)) {
        seen.add(k)
        keys.push(k)
      }
    }
  }
  if (keys.length > 0) {
    const existing = result.get(namespace) ?? []
    const merged = [...existing]
    for (const k of keys) {
      if (!merged.includes(k)) merged.push(k)
    }
    result.set(namespace, merged)
  }

  return result
}

function main(): void {
  const allByNamespace = new Map<string, string[]>()
  const files = walkDir(COMPONENTS_DIR)

  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8')
      const fileResults = extractKeyOrderFromFile(file, content)
      for (const [ns, keys] of fileResults) {
        const existing = allByNamespace.get(ns) ?? []
        const merged = [...existing]
        for (const k of keys) {
          if (!merged.includes(k)) merged.push(k)
        }
        allByNamespace.set(ns, merged)
      }
    } catch {
      // Skip files that can't be read
    }
  }

  const output: Record<string, string[]> = {}
  for (const [ns, keys] of allByNamespace) {
    if (keys.length > 0) output[ns] = keys
  }

  const outPath = resolve(process.cwd(), 'scripts/sectionContentKeyOrder.json')
  writeFileSync(outPath, JSON.stringify(output, null, 2))
  console.log(`Wrote ${outPath} with ${Object.keys(output).length} sections`)
}

main()
