import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Routes } from '@/types/enums/routes'
import BannerImage from 'public/images/banner.png'
import './styles.modules.css'

const HeroBanner = () => {
  const t = useTranslations('Home.HeroBanner')

  return (
    <div
      className="w-full flex justify-end h-[500px] relative"
      style={{
        background:
          'linear-gradient(90deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.00) 41.31%, rgba(0, 0, 0, 0.00) 57.44%, rgba(0, 0, 0, 0.33) 100%), #AEB2B9',
      }}
    >
      <div className="absolute top-0 left-0 bottom-0 m-auto h-min w-[700px] mx-32 z-banner">
        <h4 className="text-xl text-white ">{t('subtitle')}</h4>
        <h1 className="text-4xl text-white">{t('title')}</h1>
        <Link
          href={Routes.products}
          className="btn-primary w-max p-[10px] !outline-dark-violet mt-4"
        >
          {t('button')}
        </Link>
      </div>
      <Image src={BannerImage} alt={t('alt')} className="banner-image" />
    </div>
  )
}

export default HeroBanner
