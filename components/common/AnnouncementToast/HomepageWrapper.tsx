'use client'

import { usePathname } from 'next/navigation'

import { AnnouncementToast } from './index'

import { Routes } from '@/types/enums/routes'

const AnnouncementToastHomepageWrapper = () => {
  const pathname = usePathname()
  const isHomepage = pathname === Routes.home

  if (!isHomepage) {
    return null
  }

  return <AnnouncementToast />
}

export { AnnouncementToastHomepageWrapper }
