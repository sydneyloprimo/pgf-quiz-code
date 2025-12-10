'use client'

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
 */
export const useConciergeContact = (): ConciergeContact => {
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
    ? `mailto:${CONCIERGE_EMAIL}`
    : `tel:${CONCIERGE_PHONE.replace(/\s/g, '')}`

  return { href, isTabletOrLarger }
}
