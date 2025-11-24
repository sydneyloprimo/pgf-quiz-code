import Image from 'next/image'
import { useTranslations } from 'next-intl'
import BannerImage from 'public/images/banner.png'

import { Button } from '@/components/common/Button'
import { Routes } from '@/types/enums/routes'
import './styles.modules.css'

const HeroBanner = () => {
  const t = useTranslations('Home.HeroBanner')

  return (
    <div
      className="w-full flex flex-col md:flex-row justify-end h-[500px] relative"
      style={{
        background:
          'linear-gradient(90deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.00) 41.31%, rgba(0, 0, 0, 0.00) 57.44%, rgba(0, 0, 0, 0.33) 100%), #AEB2B9',
      }}
    >
      <div
        className="
        absolute
        top-0 left-0 bottom-0 
        flex flex-col items-center md:items-start
        md:m-auto h-min md:w-[700px] mx-12 mt-12 md:mx-32 
        text-center md:text-start
        z-banner"
      >
        <h4 className="text-base md:text-xl text-white ">{t('subtitle')}</h4>
        <h1 className="text-3xl md:text-4xl text-white font-bold">
          {t('title')}
        </h1>
        <Button
          variant="primary"
          href={Routes.products}
          className="w-max p-3 outline-dark-violet mt-4 z-banner"
          data-qa="hero-banner-button"
        >
          {t('button')}
        </Button>
      </div>
      <Image
        src={BannerImage}
        alt={t('alt')}
        className="banner-image object-contain md:object-cover"
      />
    </div>
  )
}

export default HeroBanner
