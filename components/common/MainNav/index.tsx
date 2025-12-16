'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

import {
  CartIcon,
  CloseIcon,
  HamburgerIcon,
  PGFTextLogo,
  SearchIcon,
} from '@/components/common/Icon'
import { Routes } from '@/types/enums/routes'
import { cn } from '@/utils/cn'

interface NavLinkProps {
  href: string
  label: string
  isActive: boolean
}

const NavLink = ({ href, label, isActive }: NavLinkProps) => (
  <Link
    href={href}
    className={cn(
      'font-display text-xl leading-8 tracking-wide',
      isActive
        ? 'text-secondary-400'
        : 'text-neutral-white hover:text-secondary-400'
    )}
  >
    {label}
  </Link>
)

const MainNav = () => {
  const t = useTranslations('MainNav')
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleToggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  const navLinks = [
    { href: Routes.home, label: t('home') },
    { href: '/formulation', label: t('ourFormulation') },
    { href: '/about', label: t('aboutUs') },
    { href: '/contact', label: t('contact') },
  ]

  const isActiveLink = (href: string) => {
    if (href === Routes.home) {
      return pathname === '/' || pathname === '/en' || pathname === '/es'
    }
    return pathname.includes(href)
  }

  return (
    <nav
      className={cn(
        'bg-secondary-950 w-full',
        'px-5 md:px-24 py-3',
        'flex items-center justify-between',
        'shadow-sm'
      )}
      aria-label={t('ariaLabel')}
    >
      {/* Logo */}
      <Link href={Routes.home} className="shrink-0" aria-label={t('logoAria')}>
        <PGFTextLogo className="h-7 w-auto text-primary-800" />
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex items-center justify-center flex-1 gap-8">
        {navLinks.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            isActive={isActiveLink(link.href)}
          />
        ))}
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="p-3 text-neutral-white hover:text-secondary-400"
          aria-label={t('searchAria')}
        >
          <SearchIcon className="size-5" />
        </button>
        <Link
          href={Routes.cart}
          className="p-3 text-neutral-white hover:text-secondary-400"
          aria-label={t('cartAria')}
        >
          <CartIcon className="size-5" />
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="lg:hidden p-3 text-neutral-white hover:text-secondary-400"
          onClick={handleToggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? t('closeMenuAria') : t('openMenuAria')}
        >
          {isMobileMenuOpen ? (
            <CloseIcon className="size-5" />
          ) : (
            <HamburgerIcon className="size-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className={cn(
            'lg:hidden absolute top-full left-0 right-0',
            'bg-secondary-950 px-5 py-6',
            'flex flex-col gap-4',
            'shadow-md z-50'
          )}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleCloseMobileMenu}
              className={cn(
                'font-display text-xl leading-8 tracking-wide py-2',
                isActiveLink(link.href)
                  ? 'text-secondary-400'
                  : 'text-neutral-white hover:text-secondary-400'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

export { MainNav }
