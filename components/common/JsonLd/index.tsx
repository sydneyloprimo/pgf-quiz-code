import { CONCIERGE_EMAIL, SITE_URL } from '@/constants'

type JsonLdData = Record<string, unknown>

interface JsonLdProps {
  data: JsonLdData | JsonLdData[]
}

const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data),
    }}
  />
)

interface OrganizationSchemaOptions {
  /** Concierge email from Contentful. Falls back to constant if not provided. */
  email?: string
}

const organizationSchema = (
  options?: OrganizationSchemaOptions
): JsonLdData => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Purely Golden Foods',
  url: SITE_URL,
  logo: `${SITE_URL}/images/pgf-logo.png`,
  sameAs: ['https://www.instagram.com/purelygoldenfoods'],
  contactPoint: {
    '@type': 'ContactPoint',
    email: options?.email ?? CONCIERGE_EMAIL,
    contactType: 'customer service',
  },
})

const websiteSchema = (): JsonLdData => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Purely Golden Foods',
  url: SITE_URL,
})

interface BreadcrumbItem {
  name: string
  url: string
}

const breadcrumbSchema = (items: BreadcrumbItem[]): JsonLdData => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})

interface FAQItem {
  question: string
  answer: string
}

const faqSchema = (items: FAQItem[]): JsonLdData => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
})

interface BlogPostSchemaInput {
  title: string
  description: string
  slug: string
  authorName?: string
  datePublished: string
  dateModified: string
  imageUrl?: string
}

const blogPostSchema = (input: BlogPostSchemaInput): JsonLdData => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: input.title,
  description: input.description,
  url: `${SITE_URL}/blog/${input.slug}`,
  datePublished: input.datePublished,
  dateModified: input.dateModified,
  ...(input.imageUrl && { image: input.imageUrl }),
  author: {
    '@type': 'Person',
    name: input.authorName ?? 'Purely Golden Foods',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Purely Golden Foods',
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/pgf-logo.png`,
    },
  },
})

export {
  blogPostSchema,
  breadcrumbSchema,
  faqSchema,
  JsonLd,
  organizationSchema,
  websiteSchema,
}
export type { BlogPostSchemaInput, BreadcrumbItem, FAQItem }
