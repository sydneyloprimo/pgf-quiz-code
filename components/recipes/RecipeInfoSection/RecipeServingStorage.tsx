'use client'

import { useTranslations } from 'next-intl'

const RecipeServingStorage = () => {
  const t = useTranslations('Recipes.ServingStorage')

  return (
    <div className="mb-8">
      <h3 className="font-display text-2xl font-normal leading-normal text-tertiary-800 mb-6">
        {t('title')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Feeding Guide */}
        <div className="md:border-r-2 md:border-tertiary-800 md:pr-8">
          <h4 className="font-sans text-base font-bold leading-normal text-black mb-4">
            {t('feedingGuide.title')}
          </h4>
          <p className="font-sans text-base font-normal leading-normal text-black">
            {t('feedingGuide.description')}
          </p>
        </div>

        {/* Storage Instructions */}
        <div>
          <h4 className="font-sans text-base font-bold leading-normal text-black mb-4">
            {t('storageTitle')}
          </h4>
          <div className="flex flex-col gap-4">
            {/* Delivered */}
            <div className="flex flex-col gap-1">
              <span className="font-sans text-base font-bold leading-normal text-black">
                {t('storageDelivered.title')}
              </span>
              <span className="font-sans text-base font-normal leading-normal text-black">
                {t('storageDelivered.description')}
              </span>
            </div>

            {/* Opened */}
            <div className="flex flex-col gap-1">
              <span className="font-sans text-base font-bold leading-normal text-black">
                {t('storageOpened.title')}
              </span>
              <span className="font-sans text-base font-normal leading-normal text-black">
                {t('storageOpened.description')}
              </span>
            </div>

            {/* Frozen */}
            <div className="flex flex-col gap-1">
              <span className="font-sans text-base font-bold leading-normal text-black">
                {t('storageFrozen.title')}
              </span>
              <span className="font-sans text-base font-normal leading-normal text-black">
                {t('storageFrozen.description')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { RecipeServingStorage }
