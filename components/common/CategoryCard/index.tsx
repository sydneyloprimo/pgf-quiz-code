import cn from 'classnames'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import BeautyImage from 'public/images/beauty.png'
import ElectronicsImage from 'public/images/electronics.png'
import FashionImage from 'public/images/fashion.png'
import FurnitureImage from 'public/images/furniture.png'

interface CategoryCardProps {
  name: string
  className: string
}

const CATEGORY_IMAGES = {
  Beauty: BeautyImage,
  Electronics: ElectronicsImage,
  Fashion: FashionImage,
  Furniture: FurnitureImage,
}

const CategoryCard = ({ name, className }: CategoryCardProps) => {
  const t = useTranslations('Home.ExploreCategories')

  return (
    <div className={cn(className, 'flex flex-row justify-center pr-3 md:pr-0')}>
      <div className="rounded shadow-4 h-[99%]">
        <Image
          src={
            CATEGORY_IMAGES[name as keyof typeof CATEGORY_IMAGES] ||
            CATEGORY_IMAGES.Electronics
          }
          alt={t('alt')}
          className="overflow-hidden"
        />
        <div className="w-full flex justify-center align-middle py-4">
          <h3 className="text-lg text-dark-grey font-bold">{name}</h3>
        </div>
      </div>
    </div>
  )
}

export default CategoryCard
