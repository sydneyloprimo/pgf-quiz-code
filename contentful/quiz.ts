import { contentfulClient } from '@/contentful/client'

const QUIZ_BREED_OPTION_CONTENT_TYPE_ID = 'quizBreedOption'
const CONTENTFUL_LOCALE_MAP: Record<string, string> = {
  en: 'en-US',
  es: 'es',
}

export interface QuizBreedOption {
  value: string
  label: string
  category?: string
}

/**
 * Fetches quiz breed options from Contentful. Returns empty array when
 * Contentful is unavailable or has no entries.
 */
export async function getQuizBreedOptions(
  locale: string
): Promise<QuizBreedOption[]> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
  if (!spaceId || !accessToken) return []
  const contentfulLocale = CONTENTFUL_LOCALE_MAP[locale] ?? locale
  try {
    const response = await contentfulClient.getEntries({
      content_type: QUIZ_BREED_OPTION_CONTENT_TYPE_ID,
      locale: contentfulLocale,
      limit: 200,
      order: ['fields.value'],
    })
    const options: QuizBreedOption[] = []
    for (const item of response.items) {
      const rawValue = item.fields.value
      const rawLabel = item.fields.label
      const rawCategory = item.fields.category
      const value =
        typeof rawValue === 'string'
          ? rawValue
          : ((rawValue as Record<string, string>)?.[contentfulLocale] ??
            (rawValue as Record<string, string>)?.['en-US'])
      const label =
        typeof rawLabel === 'string'
          ? rawLabel
          : ((rawLabel as Record<string, string>)?.[contentfulLocale] ??
            (rawLabel as Record<string, string>)?.['en-US'])
      const category =
        typeof rawCategory === 'string'
          ? rawCategory
          : ((rawCategory as Record<string, string>)?.[contentfulLocale] ??
            (rawCategory as Record<string, string>)?.['en-US'])
      if (typeof value === 'string' && typeof label === 'string') {
        options.push({ value, label, category: category ?? undefined })
      }
    }
    return options
  } catch {
    return []
  }
}
