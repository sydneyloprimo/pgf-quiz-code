'use client'

import { useTranslations } from 'next-intl'

const RecipeAAFCOStatement = () => {
  const t = useTranslations('Recipes.AAFCOStatement')

  return (
    <div className="mb-8">
      <h3 className="font-display text-2xl font-normal leading-normal text-tertiary-800 mb-4">
        {t('title')}
      </h3>
      <p className="font-sans text-base font-normal leading-normal text-black">
        <span className="font-bold block mb-2">{t('subtitle')}</span>
        {t('content')}
      </p>
    </div>
  )
}

export { RecipeAAFCOStatement }
