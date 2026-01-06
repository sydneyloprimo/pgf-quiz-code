'use client'

import { usePathname } from 'next/navigation'

import { AnnouncementToast } from './index'

import { Locale } from '@/i18n'
import { Routes } from '@/types/enums/routes'

const AnnouncementToastHomepageWrapper = () => {
  const pathname = usePathname()
  const isHomepage =
    pathname === Routes.home ||
    pathname === `/${Locale.EN}` ||
    pathname === `/${Locale.ES}`

  if (!isHomepage) {
    return null
  }

  return <AnnouncementToast />
}

export { AnnouncementToastHomepageWrapper }
