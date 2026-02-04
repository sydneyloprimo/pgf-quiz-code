import { useTranslations } from 'next-intl'

import { FORMULATION_CARDS } from '@/constants'

const RecipeFormulationLogic = () => {
  const t = useTranslations('Recipes.FormulationLogic')

  return (
    <div className="mb-8">
      <h3 className="font-display text-2xl font-normal leading-normal text-tertiary-800 mb-6">
        {t('title')}
      </h3>

      <div className="flex flex-col gap-4">
        {FORMULATION_CARDS.map((card) => (
          <div key={card.id} className="flex overflow-hidden bg-neutral-100">
            <div className="w-1 bg-tertiary-800 shrink-0" />
            <div className="p-6 flex-1">
              <p className="font-sans text-base font-normal leading-normal text-black">
                <span className="font-bold">{t(card.titleKey)}</span>{' '}
                {t(card.descriptionKey)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { RecipeFormulationLogic }
