import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/common/Button'
import QualityControl from '@/public/images/quality-control.png'
import Returns from '@/public/images/returns.png'
import Products from '@/public/images/shop-products.png'

const ShopProducts = () => {
  const t = useTranslations('Home.ShopProducts')

  return (
    <div className="w-full p-4 md:p-14 flex flex-col md:flex-row gap-8 md:gap-16">
      <Image
        src={Products}
        alt={t('image_alt')}
        className="h-[260px] md:h-auto object-cover w-auto"
      />
      <div className="flex flex-1 flex-col justify-center items-center md:items-start">
        <h1 className="text-dark-violet font-bold text-xl md:text-4xl md:max-w-md leading-8 md:leading-[88px] mb-2">
          {t('title')}
        </h1>
        <span className="text-dark-grey md:text-dark-violet text-base md:text-xl text-center md:text-left leading-8 font-regular">
          {t('description_one')}
          <br />
          {t('description_two')}
        </span>
        <div className="flex flex-row justify-start items-center text-dark-grey text-sm md:text-lg gap-3 md:gap-6 mt-4 md:mt-8 mb-3 md:mb-6 relative">
          <Image
            src={Returns}
            alt={t('returns_alt')}
            loading="eager"
            className="w-6 h-6 md:w-12 md:h-12"
          />
          <span>{t('returns')}</span>
        </div>
        <div className="flex flex-row justify-start items-center text-dark-grey text-sm md:text-lg gap-3 md:gap-6 mb-6 md:mb-8 relative">
          <Image
            src={QualityControl}
            alt={t('quality_alt')}
            loading="eager"
            className="w-6 h-6 md:w-12 md:h-12"
          />
          <span>{t('quality')}</span>
        </div>
        <Button
          variant="primary"
          href={'#'}
          className="w-max p-3 outline-dark-violet md:mt-4"
        >
          {t('button')}
        </Button>
      </div>
    </div>
  )
}

export default ShopProducts
