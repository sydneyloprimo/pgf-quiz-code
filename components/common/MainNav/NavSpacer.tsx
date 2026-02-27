'use client'

import { usePathname } from 'next/navigation'

/**
 * Renders a spacer below the fixed MainNav so content is not hidden behind it.
 * Omitted on home where the hero is full-bleed under the transparent nav.
 */
const NavSpacer = () => {
  const pathname = usePathname()
  const isHome = pathname === '/'
  if (isHome) return null
  return <div className="h-16 shrink-0" aria-hidden="true" />
}

export { NavSpacer }
