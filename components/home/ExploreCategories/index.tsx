import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import Carousel from '@/components/common/Carousel'
import { Routes } from '@/types/enums/routes'

interface ExploreCategoriesInterface {
  categories: { name: string }[]
}

const ExploreCategories = ({ categories }: ExploreCategoriesInterface) => {
  const t = useTranslations('Home.ExploreCategories')

  return (
    <div className="flex flex-col py-8 md:py-16 px-2 md:px-14 w-full items-center">
      <h4 className="text-dark-grey text-base md:text-lg">{t('subtitle')}</h4>
      <h1 className="text-xl text-dark-violet font-bold md:text-3xl">
        {t('title')}
      </h1>
      <Carousel items={categories} />
      <Button
        variant="primary"
        href={Routes.products}
        className="w-max p-3 outline-dark-violet md:mt-4"
      >
        {t('button')}
      </Button>
    </div>
  )
}

export default ExploreCategories
