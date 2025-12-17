import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import InstagramIcon from 'public/icons/instagram.svg'
import LinkedinIcon from 'public/icons/linkedin.svg'
import LogoIcon from 'public/icons/logo-white.svg'
import React from 'react'

import { instagramUrl, linkedinUrl } from '@/constants'
import { Routes } from '@/types/enums/routes'

const Footer = () => {
  const t = useTranslations('Footer')

  return (
    <footer className="bg-dark-violet w-full pb-[60px] px-4 md:px-[118px] py-9 flex justify-between">
      <Link href={Routes.home}>
        <Image
          src={LogoIcon}
          className="w-[105px] md:w-[192px]"
          alt={t('altIcon')}
        />
      </Link>
      <div className="flex">
        <a className="mr-4 my-auto h-min" href={instagramUrl} target="_blank">
          <Image
            src={InstagramIcon}
            className="w-[12px] md:w-[22px]"
            alt={t('altInstagram')}
          />
        </a>
        <a className="h-min my-auto" href={linkedinUrl} target="_blank">
          <Image
            src={LinkedinIcon}
            className="w-[12px] md:w-[22px]"
            alt={t('altLinkedin')}
          />
        </a>
      </div>
    </footer>
  )
}

export default Footer
