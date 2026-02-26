import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PropsWithChildren } from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Recipes')
  return {
    title: t('Hero.title'),
    description: t('Detail.subtitle'),
    openGraph: {
      title: t('Hero.title'),
      description: t('Detail.subtitle'),
    },
  }
}

export default function RecipesLayout({ children }: PropsWithChildren) {
  return <>{children}</>
}
