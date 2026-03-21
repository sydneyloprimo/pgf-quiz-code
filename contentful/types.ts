import type {
  Asset,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
} from 'contentful'

export interface CategorySkeleton extends EntrySkeletonType {
  contentTypeId: 'category'
  fields: {
    name: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
  }
}

export interface AuthorSkeleton extends EntrySkeletonType {
  contentTypeId: 'author'
  fields: {
    name: EntryFieldTypes.Symbol
    title: EntryFieldTypes.Symbol
    profilePicture?: EntryFieldTypes.AssetLink
  }
}

export interface BlogPostSkeleton extends EntrySkeletonType {
  contentTypeId: 'blogPost'
  fields: {
    title: EntryFieldTypes.Symbol
    subtitle?: EntryFieldTypes.Symbol
    slug: EntryFieldTypes.Symbol
    author: EntryFieldTypes.EntryLink<AuthorSkeleton>
    content: EntryFieldTypes.RichText
    categories?: EntryFieldTypes.Array<
      EntryFieldTypes.EntryLink<CategorySkeleton>
    >
    references?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  }
}

export type CategoryEntry = Entry<CategorySkeleton, undefined, string>
export type AuthorEntry = Entry<AuthorSkeleton, undefined, string>
export type BlogPostEntry = Entry<BlogPostSkeleton, undefined, string>

export interface AuthorFields {
  name: string
  title: string
  profilePicture?: Asset
}

export interface BlogPostFields {
  title: string
  subtitle?: string
  slug: string
  author: Entry<AuthorSkeleton, undefined, string>
  content: EntryFieldTypes.RichText
  references?: string[]
}
