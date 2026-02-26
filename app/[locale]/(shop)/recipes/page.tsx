import { RecipesPageClient } from './RecipesPageClient'

import { getRecipeTables } from '@/contentful/recipeTables'

export default async function RecipesPage() {
  const tables = await getRecipeTables()

  return <RecipesPageClient tables={tables} />
}
