/**
 * Analyzes en.json structure to identify component patterns and map them to component types.
 */

type EnJson = Record<string, unknown>

export type ComponentType =
  | 'Hero'
  | 'Benefits'
  | 'FAQ'
  | 'Reviews'
  | 'Features'
  | 'HowItWorks'
  | 'TextBlock'
  | 'RichText'

export interface ComponentPattern {
  type: ComponentType
  fields: string[]
  identifier: (obj: Record<string, unknown>) => boolean
}

export const COMPONENT_PATTERNS: ComponentPattern[] = [
  {
    type: 'Hero',
    fields: ['headline', 'ctaButton'],
    identifier: (obj) =>
      typeof obj.headline === 'string' &&
      (typeof obj.ctaButton === 'string' || typeof obj.ctaLink === 'string'),
  },
  {
    type: 'Benefits',
    fields: ['benefit1Title', 'benefit1Description'],
    identifier: (obj) =>
      typeof obj.benefit1Title === 'string' &&
      typeof obj.benefit1Description === 'string',
  },
  {
    type: 'FAQ',
    fields: ['faq1Question', 'faq1Answer'],
    identifier: (obj) =>
      typeof obj.faq1Question === 'string' &&
      typeof obj.faq1Answer === 'string',
  },
  {
    type: 'Reviews',
    fields: ['review1Name', 'review1Quote'],
    identifier: (obj) =>
      typeof obj.review1Name === 'string' &&
      typeof obj.review1Quote === 'string',
  },
  {
    type: 'Features',
    fields: ['clinicalTitle', 'clinicalDescription'],
    identifier: (obj) =>
      typeof obj.clinicalTitle === 'string' &&
      typeof obj.clinicalDescription === 'string',
  },
  {
    type: 'HowItWorks',
    fields: ['step1Title', 'step1Description'],
    identifier: (obj) =>
      typeof obj.step1Title === 'string' &&
      typeof obj.step1Description === 'string',
  },
]

export function isRichTextDocument(
  value: unknown
): value is { nodeType: string; content?: unknown[] } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'nodeType' in value &&
    (value as { nodeType: string }).nodeType === 'document'
  )
}

export function identifyComponentType(
  obj: Record<string, unknown>
): ComponentType | null {
  // Check for rich text first
  if ('content' in obj && isRichTextDocument(obj.content)) {
    return 'RichText'
  }

  for (const pattern of COMPONENT_PATTERNS) {
    if (pattern.identifier(obj)) {
      return pattern.type
    }
  }

  // Default to TextBlock if it has title/description
  if (
    typeof obj.title === 'string' &&
    (typeof obj.description === 'string' ||
      typeof obj.content === 'string' ||
      isRichTextDocument(obj.content))
  ) {
    return 'TextBlock'
  }

  // If it has any text fields, treat as TextBlock
  if (Object.keys(obj).length > 0) {
    return 'TextBlock'
  }

  return null
}

export interface PageStructure {
  pageKey: string
  slug: string
  components: Array<{
    sectionKey: string
    componentType: ComponentType
    data: Record<string, unknown>
  }>
}

export interface GlobalContent {
  namespace: string
  data: Record<string, unknown>
}

const GLOBAL_NAMESPACES = new Set([
  'Common',
  'Header',
  'Footer',
  'MainNav',
  'Navigation',
])

const PAGE_SLUG_MAP: Record<string, string> = {
  Home: '/',
  About: '/about',
  Formulation: '/formulation',
  Quiz: '/quiz',
  Auth: '/auth/sign-in',
  SignIn: '/auth/sign-in',
  SignUp: '/auth/sign-up',
  BlogIndex: '/blog',
  BlogPostPage: '/blog',
  PromiseOfCareAlert: '/blog',
  PrivacyPolicy: '/privacy-policy',
  TermsAndConditions: '/terms-and-conditions',
}

export function analyzeEnJson(enJson: EnJson): {
  pages: PageStructure[]
  globalContent: GlobalContent[]
} {
  const pages: PageStructure[] = []
  const globalContent: GlobalContent[] = []

  for (const [topKey, topValue] of Object.entries(enJson)) {
    // Skip Profile
    if (topKey === 'Profile') continue

    // Handle global namespaces
    if (GLOBAL_NAMESPACES.has(topKey)) {
      globalContent.push({
        namespace: topKey,
        data: topValue as Record<string, unknown>,
      })
      continue
    }

    // Handle pages
    if (
      typeof topValue === 'object' &&
      topValue !== null &&
      !Array.isArray(topValue)
    ) {
      const pageData = topValue as Record<string, unknown>
      const slug = PAGE_SLUG_MAP[topKey] || `/${topKey.toLowerCase()}`
      const components: PageStructure['components'] = []

      // Check if this is a rich text page (PrivacyPolicy, TermsAndConditions)
      if ('content' in pageData && isRichTextDocument(pageData.content)) {
        components.push({
          sectionKey: 'content',
          componentType: 'RichText',
          data: { content: pageData.content },
        })
        // Also check for Hero section
        if ('Hero' in pageData && typeof pageData.Hero === 'object') {
          const heroData = pageData.Hero as Record<string, unknown>
          const heroType = identifyComponentType(heroData)
          if (heroType) {
            components.push({
              sectionKey: 'Hero',
              componentType: heroType,
              data: heroData,
            })
          }
        }
      } else {
        // Regular page with sections
        for (const [sectionKey, sectionValue] of Object.entries(pageData)) {
          if (
            typeof sectionValue === 'object' &&
            sectionValue !== null &&
            !Array.isArray(sectionValue)
          ) {
            const sectionData = sectionValue as Record<string, unknown>
            const componentType = identifyComponentType(sectionData)
            if (componentType) {
              components.push({
                sectionKey,
                componentType,
                data: sectionData,
              })
            } else {
              // If we can't identify the type, still add it as TextBlock with all data
              components.push({
                sectionKey,
                componentType: 'TextBlock',
                data: sectionData,
              })
            }
          }
        }
      }

      // Always add page, even if it has no components (for pages with flat structure)
      pages.push({
        pageKey: topKey,
        slug,
        components,
      })
    }
  }

  return { pages, globalContent }
}
