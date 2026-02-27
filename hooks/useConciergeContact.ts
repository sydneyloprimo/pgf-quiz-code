'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { CONCIERGE_EMAIL, CONCIERGE_PHONE, MediaQuery } from '@/constants'

interface ConciergeContact {
  href: string
  isTabletOrLarger: boolean
}

/**
 * Hook that provides the appropriate contact method for the concierge
 * based on the device size.
 *
 * - Tablet/Desktop (>= 768px): Returns mailto: link
 * - Mobile (< 768px): Returns tel: link
 *
 * Contact info is sourced from Contentful (ContactInfo) with fallback to
 * constants when Contentful is unavailable.
 */
export const useConciergeContact = (): ConciergeContact => {
  const t = useTranslations('ContactInfo')
  const email = t('conciergeEmail') || CONCIERGE_EMAIL
  const phone = t('conciergePhone') || CONCIERGE_PHONE

  const [isTabletOrLarger, setIsTabletOrLarger] = useState(true)

  useEffect(() => {
    const mediaQuery = window.matchMedia(MediaQuery.desktop)
    setIsTabletOrLarger(mediaQuery.matches)

    const handleChange = (event: { matches: boolean }) => {
      setIsTabletOrLarger(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const href = isTabletOrLarger
    ? `mailto:${email}`
    : `tel:${phone.replace(/\s/g, '')}`

  return { href, isTabletOrLarger }
}
