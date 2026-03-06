import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PropsWithChildren } from 'react'

import { Locale } from '@/i18n'

type RecipesLayoutProps = PropsWithChildren<{
  params: Promise<{ locale: Locale }>
}>

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
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

export default async function RecipesLayout({
  children,
  params,
}: RecipesLayoutProps) {
  const { locale } = await params
  setRequestLocale(locale)
  return <>{children}</>
}
